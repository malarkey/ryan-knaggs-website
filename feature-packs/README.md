# Feature Pack Conventions

Feature packs keep this boilerplate modular.

## Pack structure

Each pack lives at `feature-packs/<name>/` and should include:

- `plugin.js`: registers collections, filters, or shortcodes
- `manifest.json`: metadata used by install scripts
- `cms-config.yml`: optional Netlify CMS fragments merged by the installer
- `files/`: starter files copied into the project when enabled

Optional but recommended inside `files/`:

- `src/css/<name>.css`: styles loaded only when that feature flag is enabled

## Manifest shape

```json
{
  "featureFlag": "team",
  "mainNavigationItems": [
    {
      "text": "Team",
      "url": "/team/"
    }
  ],
  "footerNavigationItems": [],
  "cms": false
}
```

## Add a pack

1. Create `feature-packs/<name>/plugin.js`
2. Add starter files under `feature-packs/<name>/files/`
3. Add `<name>: false` to `features.json`
4. Load the pack conditionally in `.eleventy.js`
5. Add an npm script that calls `scripts/add-feature.js <name>`

Current examples:

- `npm run add:blog`
- `npm run add:faqs`
- `npm run add:portfolio`
- `npm run add:team`
