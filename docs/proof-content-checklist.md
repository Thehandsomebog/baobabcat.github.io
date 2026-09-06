# Public proof content checklist

Add approved client proof to `content/proof.cjs`; do not edit generated page markup.

Every `proofEntries` item must include:

- `slug`, `category`, `clientDisplayName`, `problem`, `intervention`, and `outcome`
- `approvedForPublicUse: true`
- `evidenceReviewedAt` as an ISO date
- at least one metric with `label`, `value`, `method`, and `timeframe`
- if a testimonial is present: `quote`, `attribution`, `role`, and `permissionConfirmed: true`
- `anonymized: true` when the public label is not the client's approved name

Before approval, keep the entry out of `proofEntries`. Never adapt representative patterns into client claims without evidence and publication permission.

Result-bearing articles must set `claimsResults: true` and `proofSlug` to an approved proof entry. The generator rejects claims without this link, including common numerical first-person claims. Automated detection is a backstop, not a substitute for editorial review: inspect titles, summaries, body text, and social copy for implied client outcomes.

Representative articles must explicitly identify themselves as examples, set `representative: true`, and avoid measured-performance claims. Keep existing article slugs when correcting a headline so external links continue to work.

Write complete `seoDescription` text in the post or `content/editorial.cjs`. The generator validates length but does not cut sentences. Add genuine `updatedAt` dates when article content changes; do not advance dates just to suggest freshness. The default author is the BaobabCat organization. Add a named author only after their identity, role, and publication approval are confirmed.
