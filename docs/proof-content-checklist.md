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
