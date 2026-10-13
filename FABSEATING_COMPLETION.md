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
