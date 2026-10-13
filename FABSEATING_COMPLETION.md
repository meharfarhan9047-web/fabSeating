# Follow-up: Main Gallery (/projects)

The main Gallery page now reads **Homepage → Main Gallery Photos** from Sanity. It no longer reads local image folders. All 74 existing Gallery files were imported as 68 unique editable images. Drag to reorder, add or delete photos, then Publish. An empty gallery stays empty rather than reverting to repository photos.

Deploy both the website and updated Sanity Studio after merging this follow-up so the editor field appears. The existing homepage webhook invalidates the Gallery; a five-minute revalidation interval is also configured.

The import command is `node scripts/seed-main-gallery-to-sanity.js --commit`. It only populates a missing field, preserving existing edits and intentional empty galleries.

---

# FabSeating CMS and gallery completion

## Behavior

- Homepage category covers, names, descriptions, product associations and brand logos come from the published Homepage document.
- The furniture section follows the supplied circular-category reference, with touch scrolling and previous/next controls. Brand logos use a uniform bordered row/grid.
- Category pages show all views of each Sanity product. Thumbnail buttons update the main view; the product stays within a square frame without cropping its edges.
- Residential hero and lower galleries both use Solutions → Residential → Gallery Images, in equal-size frames.
- Every case-study route, including the two previously hardcoded residential URLs, reads its title, text, hero, gallery, story, statistics and testimonial from Sanity. Empty media slots are never rendered as blank frames.
- Case-study filters show only matching records and a clear empty state. Retail and Other are included so all supported CMS sectors are reachable.
- The Sanity webhook uses the SDK signature verifier and invalidates product/category caches as well as case-study data. Without a webhook, changed pages revalidate periodically (category/residential: five minutes).
- Case studies are included in the sitemap. Google credentials and API tokens are not required in the browser application.

## Content operations

The existing product library was imported into the production dataset using deterministic IDs. Existing records are skipped by reruns. Four additional showroom products use paired photographs of the same pieces to demonstrate multiple views.

Homepage fields were populated only when empty, and the same missing fields were added to its existing draft without publishing that draft. Published content is explicitly selected by the frontend.

Empty residential case-study gallery slots were repaired using photographs from the corresponding project folders. Existing valid uploaded images and client text were retained. HEIC photographs were converted to JPEG for browser-compatible delivery.

## Editing

1. Homepage → Furniture & furnishing categories → Cover image: upload or replace each category cover.
2. Homepage → Brand partners strip → Logo: replace the brand mark.
3. Product → Product images / views: first image is the main view; subsequent images become thumbnail choices.
4. Solutions → Residential → Gallery Images: first three appear at the top; the full gallery appears below.
5. Case Studies → select a project: edit content and images, then Publish.

The remaining categories without matching photographs retain clear placeholders and editable upload fields. They must use client-approved category photos rather than unrelated furniture shots.

## Review and release

- Merge the website PR to the deployment branch after review. A PR does not itself publish the website.
- Build and deploy the updated Studio from `sanity/fabseating-website` so the clarified image fields and gallery limit are visible in the hosted Studio.
- Vercel requires `NEXT_PUBLIC_SANITY_PROJECT_ID=n59kaaxb` and `NEXT_PUBLIC_SANITY_DATASET=production`. Use the client's production domain for `NEXT_PUBLIC_SITE_URL`.
- Set `SANITY_WEBHOOK_SECRET` on the website and the same secret on the Sanity webhook. The webhook URL is the deployed site's `/api/sanity-webhook` endpoint.
- Content upload scripts require a private `SANITY_API_WRITE_TOKEN`. Keep it out of Git and public environment variables. The public frontend reads the published public dataset without that token.

## Validation

Run `npm ci`, `npx tsc --noEmit` and `npm run build` at the project root. Run `npm ci` and `npm run build` in the Studio directory.

Verification covers real Sanity responses, case-study filter results including empty sectors, all three case-study routes, product-gallery thumbnail interaction, residential gallery output and CMS category/logo rendering. Browser-bundle scanning checks that the write token is absent. Live deployment/browser verification depends on the client's preview deployment becoming available.

## Additional empty-gallery fixes

Category collections and the Residential solution gallery now use Sanity images exclusively. Clearing products or gallery photos no longer restores repository images. Category pages show their existing collection-coming-soon state, and empty Residential image sections are hidden. Six category covers still require client-approved photographs: wardrobes, TV consoles, storage solutions, modular kitchens, wallpapers and doors.

## Stability improvements (no design changes)

- Hero and card videos use the existing lazy video component. They attach media near the viewport and pause outside it or while the document is hidden, preserving posters, frames and styling.
- Header scroll observation is passive and initializes correctly after scroll restoration. Mobile navigation locks background scrolling and closes on Escape, route changes and desktop resizing.
- Service-worker registration works even after the window load event. Development cleanup touches only FabSeating caches. Native install prompts are no longer suppressed without an install action.
- The worker caches only public HTML navigations, excludes APIs/admin/Next.js data requests, limits offline pages to 30 and returns a valid error response for uncached offline pages. Old FabSeating caches are removed on activation.
- Enquiries return 503 if delivery is not configured and 502 on provider rejection; they no longer falsely report success. The form prevents duplicate in-flight submits and times out after 30 seconds. Verify RESEND_API_KEY and the verified fabseating.com sender before release; real delivery was not tested.
- Review requests cancel on unmount; reveal sections remain visible on browsers without IntersectionObserver. The manifest header no longer caches an editable manifest for a year.

Validation: production Next.js build (including lint/type checks) passed with the published Sanity dataset; eight production routes returned HTTP 200. `node scripts/verify-stability.cjs` passed enquiry and worker regressions. DOM interaction checks passed mobile-menu scroll locking/Escape/desktop resize and lazy video loading/play/pause. No external email was sent.

The initial Chromium download failed; a subsequent packaged Chromium fallback enabled real-browser verification. Mobile/desktop viewport and interaction checks are now recorded in RECHECK_REPORT.md. Lighthouse scores and physical-device results are not claimed. Actual enquiry delivery remains a release check. Existing layouts, CSS classes, typography, content and image frames were retained.

## Full local recheck

See RECHECK_REPORT.md for route, browser, API and interaction coverage and the remaining deployment/content checks. The project-detail route, sitemap, narrow-screen wrapping, two article tables and one invalid Office image URL were repaired during this audit.

## Additional media editors

Homepage: Hero video upload, Hero background image and About section → Video upload / Poster image. Site Settings: Logo. Solutions: Secondary Image. Article Images: select an existing article and replace its illustration. These fields read published Sanity content; the website uses CMS-hosted assets. Updated Studio deployment is required.

`node scripts/migrate-visible-media-to-sanity.cjs --commit` prepares missing legacy media fields and requires ffmpeg for video poster extraction. It retains valid client media. The deployed references were additionally optimized for web playback; source clips are retained in the repository.
