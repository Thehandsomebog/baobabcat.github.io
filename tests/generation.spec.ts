import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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
