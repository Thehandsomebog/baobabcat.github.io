# Codex Daily Blog Automation

Use Codex Automations against this repo only after connecting the repository and configuring the automation to run in review mode.

## Source of truth

- Blog content lives in `content/posts.cjs`
- Generated output lives in `blog.html` and the homepage preview section inside `index.html`
- Regenerate with `npm run generate:blog`

## Safe workflow

1. Add one new post object to `content/posts.cjs`
2. Keep `status: "published"` if the automation should post immediately
3. Use `status: "draft"` if you want the post written but not rendered yet
4. Keep `featured: false` by default so the homepage stays curated
5. Set `featured: true` only when you intentionally want a post on the homepage
6. Run `npm run generate:blog`
7. Run `npm test`
8. Leave the result in review or open a PR instead of force-pushing blind

## Required post fields

- `slug`
- `title`
- `date` in `YYYY-MM-DD`
- `readTime`
- `category`
- `filename`
- `status`
- `featured`
- `summary`
- `homeSummary`
- `bodyHtml`

## Writing rules

- Write AI-related posts only
- Match the site voice: practical, direct, not hype-heavy
- Do not invent customer names, approvals, metrics, or claims unless they already exist in the repo and are approved for public use
- Include at least one internal link to a relevant service or contact page
- Keep OpenClaw content in proportion; it is one service, not the whole business
- Prefer operational topics: workflow design, support automation, deployment discipline, adoption, analytics, and AI ROI
- Default to `featured: false` unless the task explicitly says to promote the post to the homepage

## Example Codex Automation prompt

```
Review content/posts.cjs and add exactly one new published AI-related blog post in the BaobabCat voice.

Requirements:
- pick a topic that is not already covered too closely by existing posts
- make it useful, concrete, and readable
- no fake claims, fake metrics, or fake case-study details
- include a strong internal CTA to a relevant service or the contact page
- keep the post customer-facing and public-safe
- keep featured as false unless explicitly told otherwise

After writing:
- run npm run generate:blog
- run npm test
- summarize the new topic, changed files, and test result
```
