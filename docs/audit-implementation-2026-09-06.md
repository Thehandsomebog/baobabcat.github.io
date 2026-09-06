# September 6 audit implementation

Implements the live-site and code audit associated with Beads issue `baobabcat.github.io-aml`.

## Delivered changes

- Normalize internal navigation, assets, article content and nested 404 recovery URLs. Test links from the desktop preview, not just standalone documents.
- Restore reader Back/Forward/Escape/focus behavior and active Blog navigation. Load and cache article bodies on demand with a usable full-article fallback and protection against stale responses.
- Reduce the archive document from 941,421 to 117,883 bytes (about 87%) while retaining searchable metadata and ordinary canonical links.
- Reframe the unsupported response-time claim as an explicitly representative design. Require an approved `proofSlug` for result-bearing article records; keep approval requirements in the proof-content checklist.
- Correct filter/search event semantics and total result counts without sending raw search text. In GA4 property `521868247`, register `generate_lead` as a key event with no invented monetary value, plus event-scoped `service_slug` and `cta_id` dimensions. OpenSEO measurement health confirmed these settings.
- Add canonical/social metadata, branded social images and sitemap entries for all six service-detail pages. Stop assigning static pages a modification date merely because a new article was published.
- Replace 39 clipped descriptions with complete editorial copy. Do not silently truncate future titles or descriptions; the publishing budget requires an explicit editorial correction.
- Add curated support, service-intake and safe-deployment reading paths, related articles, truthful organizational attribution and BlogPosting structured data. Preserve existing article URLs.
- Refine consent choices, desktop ASCII-mark sizing, narrow reader-list title layout, human-centered service copy and engagement scope guidance. Keep motion restrained and functional, following the Emil design skill.
- Build deployment output from the published manifest, excluding stale unpublished article files and cards. Validate the actual artifact with real 404 behavior before deployment; isolate Lighthouse staging from browser-test staging.
- Preserve reviewed social-card bytes across operating systems using a committed rendering-input/output fingerprint manifest. The first Linux release check exposed differing font rasterization; changed inputs or corrupted output still trigger regeneration and the generated-diff gate.
- Expand axe, contact-timeout, navigation/history, metadata and publishing regression coverage. Fix the short-page background that caused a WebKit 404 contrast failure.

## Verification

- Full browser suite: 215 passed, 31 intentionally skipped by platform/project conditions. Chromium, Firefox, WebKit and responsive projects are included.
- SEO/reference checks: 136 indexable pages, including canonical, sitemap, internal-link, fragment, social-asset and nested-404 recovery checks.
- Local mobile Lighthouse: home/contact/article 100 performance; archive 99. All four routes scored 100 for accessibility, best practices and SEO. Measured LCP was at most 1.66 seconds, CLS 0 and TBT at most 25 ms in the recorded run. These are local lab measurements, not production field Core Web Vitals.
- Visually inspected the 390-pixel homepage, 1200-pixel homepage and open desktop reader. Automated accessibility checks do not establish real-device screen-reader conformance.
- Contact submissions were mocked; no real customer message was sent. Consent/tag-loading behavior was preserved from the existing privacy-safe Consent Mode implementation.

## Remaining evidence-dependent work

- `baobabcat.github.io-3rb`: real iPhone/iPad/Android testing, VoiceOver/TalkBack, and an explicitly authorized production form-delivery/GA4 DebugView check.
- `baobabcat.github.io-a8t`: approved individual author/reviewer credentials and documented client proof. Organizational attribution and representative content remain in place until these are supplied.

Release procedure: commit generated output, run `npm run check:generated`, sync Beads, push, wait for the Pages quality gates/deployment, then re-crawl the public site in OpenSEO. Do not describe local checks alone as a successful production release.
