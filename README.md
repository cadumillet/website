## Personal Archive / Blog / Portfolio

Next.js (Pages Router) site for publishing MDX-based entries that double as an archive, blog, and portfolio.

### Content model
- **Location**: `src/content/YYYYMM/NNN.mdx`
- **Slug**: derived from file path (e.g., `202501/001`)
- **Front matter**: common fields include `title`, `thumbnail`, `textColor`, `backgroundColor`, `fontFamily`, `padding`, `basePath`.

### Sorting
Projects are ordered by folder and filename, newest first:
1. Desc by `YYYYMM` (month)
2. Desc by `NNN` (entry within the month)

Implemented in `src/lib/mdx.ts` via `getAllProjects()`.

### Gallery behavior
`src/components/Gallery.tsx` lays out images in a grid with per-row uniform height:
- Each row’s height is set by the widest image’s aspect ratio in that row.
- Mixed orientations: tall images are cropped to match the row height (`object-cover`).
- All-tall rows: no cropping when ratios align.

### Local development
```bash
npm install
npm run dev
# http://localhost:3000
```

### Adding a new entry
Create a file like `src/content/202501/002.mdx`:
```mdx
---
title: My Entry
thumbnail: /path/to/thumb.jpg
textColor: '#111'
backgroundColor: '#fafafa'
fontFamily: 'Georgia, serif'
padding: '1.5rem'
basePath: '/assets/my-entry'
---

# Heading

<Gallery images={["/assets/my-entry/01.jpg", "/assets/my-entry/02.jpg"]} columns={3} />

Some MDX content here.
```

### Pages
- `src/pages/index.tsx`: lists projects (uses `getAllProjects()` sorting)
- `src/pages/projects/[...slug].tsx`: renders MDX per slug with custom components

## Next steps (TODO)
- [ ] **Custom font**: set fontFamily in metadata or per text block
- [ ] **Global Search and filtering**: client-side search across titles and front matter
- [ ] **Element Metadata**: allow image cropping/scaling and text format
- [ ] **Content**: tags, gear/tools used, location
- [ ] **Pagination**: paginate or infinite-scroll projects on `index.tsx`
- [ ] **Images**: migrate to `next/image` with responsive sizes and blur placeholders
- [ ] **Lightbox**: open gallery images in modal with keyboard navigation
- [ ] **SEO**: dynamic meta, OpenGraph/Twitter cards, sitemap, canonical URLs
- [ ] **Feeds**: RSS/Atom/JSON feed generated from MDX front matter
- [ ] **Drafts**: support `draft: true` and preview mode
- [ ] **Analytics**: simple privacy-friendly analytics integration
- [ ] **A11y**: audit alt text, focus states, and keyboard traps in modals
- [ ] **Performance**: image prefetching for thumbnails and near-fold content
- [ ] **Theming**: optional dark mode and per-entry theme overrides
- [ ] **Build**: CI checks (typecheck, lint) and deploy preview configuration
- [ ] **i18n**: basic internationalization, if needed
