import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

const root = path.resolve(__dirname, '..');
const posts = require('../content/posts.cjs');
const proof = require('../content/proof.cjs');
const generator = require('../scripts/generate-blog.js');
const published = posts.filter((post) => (post.status || 'published') === 'published');

function digestGenerated() {
  const files = [
    'index.html',
    'blog.html',
    'case-studies.html',
    'sitemap.xml',
    'assets/social/manifest.json',
    'og-image.jpg',
    ...fs.readdirSync(path.join(root, 'services')).filter((file) => file.endsWith('.html')).flatMap((file) => [`services/${file}`, `assets/social/service-${file.replace(/\.html$/, '')}.jpg`]),
    ...published.map((post) => `blog/${post.slug}/index.html`),
    ...published.map((post) => `assets/social/${post.slug}.jpg`),
  ];
  const hash = createHash('sha256');
  files.sort().forEach((file) => hash.update(fs.readFileSync(path.join(root, file))));
  return hash.digest('hex');
}

test.describe('Generated publishing contracts', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Generation is browser-independent and runs once.');

  test('generation is idempotent and creates every canonical article', () => {
    const before = digestGenerated();
    execFileSync(process.execPath, ['scripts/generate-blog.js'], { cwd: root });
    expect(digestGenerated()).toBe(before);

    for (const post of published) {
      const html = fs.readFileSync(path.join(root, 'blog', post.slug, 'index.html'), 'utf8');
      expect(html).toContain(`https://baobabcat.com/blog/${post.slug}/`);
    }
  });

  test('sitemap includes every published canonical URL', () => {
    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    for (const post of published) {
      expect(sitemap).toContain(`https://baobabcat.com/blog/${post.slug}/`);
    }
  });

  test('social fingerprints validate rendering inputs and reviewed output bytes', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/social/manifest.json'), 'utf8'));
    for (const [file, entry] of Object.entries(manifest) as [string, { inputHash: string; outputHash: string }][]) {
      expect(createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'), file).toBe(entry.outputHash);
    }
    for (const post of published) {
      const entry = manifest[`assets/social/${post.slug}.jpg`];
      expect(entry.inputHash).toBe(generator.socialInputHash(post.title, post.category));
      expect(entry.inputHash).not.toBe(generator.socialInputHash(`${post.title} changed`, post.category));
    }
  });

  test('deployment includes the Search Console verification file unchanged', () => {
    const verificationFile = 'googlefcc2469c106d4caa.html';
    const expected = `google-site-verification: ${verificationFile}`;
    const source = fs.readFileSync(path.join(root, verificationFile), 'utf8');
    expect(source.trim()).toBe(expected);
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'baobabcat-deploy-test-'));
    try {
      const artifact = require('../scripts/prepare-deploy').prepareDeploy(path.join(temporary, 'site'));
      expect(fs.readFileSync(path.join(artifact, verificationFile), 'utf8')).toBe(source);
    } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  });

  test('archive presentation shortens repeated series titles without changing canonical titles', () => {
    const post = published.find((entry) => entry.slug === 'what-to-clean-up-before-ai-touches-your-customer-data-retention-rules');
    const presentation = generator.getArchivePresentation(post);
    expect(presentation).toEqual({
      displayTitle: 'Customer data retention rules',
      series: 'Before AI touches…',
    });
    expect(post.title).toBe('What to clean up before AI touches your customer data retention rules');
  });

  test('generated article metadata stays inside OpenSEO length limits', () => {
    const seoTitles = new Set<string>();
    for (const post of published) {
      const title = generator.getSeoTitle(post);
      const description = generator.getSeoDescription(post);
      expect(title.length, post.slug).toBeGreaterThanOrEqual(10);
      expect(title.length, post.slug).toBeLessThanOrEqual(60);
      expect(description.length, post.slug).toBeGreaterThanOrEqual(70);
      expect(description.length, post.slug).toBeLessThanOrEqual(160);
      expect(seoTitles.has(title), `duplicate SEO title: ${title}`).toBe(false);
      seoTitles.add(title);
    }
  });

  test('all indexable pages pass OpenSEO-compatible on-page checks', () => {
    expect(() => execFileSync(process.execPath, ['scripts/check-seo.js'], { cwd: root })).not.toThrow();
  });

  test('social cards have the required dimensions and budget', async () => {
    for (const slug of [published[0].slug, 'why-ai-pilots-stall']) {
      const imagePath = path.join(root, 'assets', 'social', `${slug}.jpg`);
      const metadata = await sharp(imagePath).metadata();
      expect(metadata.width).toBe(1200);
      expect(metadata.height).toBe(630);
      expect(fs.statSync(imagePath).size).toBeLessThanOrEqual(200 * 1024);
    }
  });

  test('approved proof validation rejects incomplete evidence', () => {
    proof.proofEntries.push({ slug: 'invalid-proof', approvedForPublicUse: true });
    expect(() => generator.getApprovedProof()).toThrow(/missing category/);
    proof.proofEntries.pop();
  });

  test('unverified names are replaced by a representative-pattern disclosure', () => {
    const cases = fs.readFileSync(path.join(root, 'case-studies.html'), 'utf8');
    expect(cases).toContain('Representative engagement patterns');
    expect(cases).not.toContain('TechFlow');
    expect(cases).not.toContain('Elevate Wellness');
    expect(cases).not.toContain('Meridian Logistics');
  });
});
