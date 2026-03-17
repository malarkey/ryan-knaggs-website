# Eleventy + Netlify CMS Boilerplate

A reusable Eleventy starter for brochure sites, blogs, and small editorial projects.
Includes optional feature packs so you can keep core projects clean and add modules when needed.

## Included

- Eleventy v3
- Netlify CMS admin at `/admin/`
- Neutral starter content and placeholder assets
- Feature-pack system for optional modules

## Install

```bash
npm install
```

## Develop

```bash
npm run start
```

The development server runs at [http://localhost:8080](http://localhost:8080).

## Build

```bash
npm run build
```

Static files are written to `dist/`.

## Feature Packs

The base boilerplate is intentionally minimal.
Optional sections (for example, blog, FAQs, portfolio, and team) can be added as feature packs.

- Feature flags are in `features.json`
- Pack code lives in `feature-packs/<name>/`
- Drop-in content/layout starter files live in `feature-packs/<name>/files/`
- Feature styles can live in `feature-packs/<name>/files/src/css/<name>.css` and are loaded only when enabled

### Add Team Pack

```bash
npm run add:team
```

This command:

1. Enables `"team": true` in `features.json`
2. Copies team layouts/content into `src/`
3. Adds `/team/` to `src/_data/navigation.json` if missing
4. Merges the Team page and collection into `src/admin/config.yml`

### Add Blog Pack

```bash
npm run add:blog
```

This command:

1. Enables `"blog": true` in `features.json`
2. Copies blog layouts/content into `src/`
3. Adds `/blog/` to `src/_data/navigation.json` if missing
4. Merges the Blog page and posts collection into `src/admin/config.yml`

### Add FAQs Pack

```bash
npm run add:faqs
```

This command:

1. Enables `"faqs": true` in `features.json`
2. Copies FAQ layouts, content, and sample entries into `src/`
3. Adds `/faqs/` to footer navigation
4. Merges the FAQ page and collection into `src/admin/config.yml`

### Add Portfolio Pack

```bash
npm run add:portfolio
```

This command:

1. Enables `"portfolio": true` in `features.json`
2. Copies portfolio layouts, content, and sample entries into `src/`
3. Adds `/portfolio/` to both main and footer navigation
4. Merges the portfolio page and collection into `src/admin/config.yml`

You can preview changes without writing files:

```bash
node scripts/add-feature.js team --dry-run
node scripts/add-feature.js blog --dry-run
node scripts/add-feature.js faqs --dry-run
node scripts/add-feature.js portfolio --dry-run
```

## Content Model

- `src/index.md`: homepage
- `src/about.md`: about page
- `src/contact.md`: contact page
- `src/_data/site.json`: site-wide metadata
- `src/_data/navigation.json`: main navigation
- `src/_data/footer_navigation.json`: footer navigation

## Netlify CMS

The CMS is configured for Git Gateway on the `main` branch. Before launching a real site:

1. Update `src/_data/site.json` with your production URL and contact details.
2. Replace the starter copy with project content.
3. Enable Netlify Identity and Git Gateway in your Netlify project.
