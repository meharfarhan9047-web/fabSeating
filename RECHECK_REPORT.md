# FabSeating local production recheck

## Result

The production site was rebuilt and run locally against the published Sanity dataset n59kaaxb/production. A packaged Chromium browser enabled real rendering and interaction checks after the original browser download failed.

## Coverage and evidence

- 33 public routes at 320, 390, 768 and 1440 pixels: 132 browser checks. Routes cover homepage, Gallery, Contact, bespoke, all solution pages, all 13 categories, three case studies, three CMS projects, blog index and five static articles. No JavaScript exceptions or non-200 page responses were observed.
- 32 targeted browser checks after repairs: Office, Hospitality, the Nungambakkam case study, both affected blogs and all three CMS projects at four widths. No document overflow remained. Article comparison tables also stayed within their iframe viewport after scrolling wrappers were added.
- Actual project headings X, Y and Z were verified in the browser. A raw HTML search for “Page not found” is insufficient because Next serializes its global not-found boundary into otherwise successful responses. Visible page content was checked instead.
- Actual mobile-menu open/Escape behavior passed; mobile-to-desktop resizing closes it and releases body scroll locking.
- Actual Sanity product thumbnail selection passed on the Sofas page, which contains two multi-view cards. The main image changed to the selected view.
- All 68 main Gallery image URLs matched the published Sanity image references in order.
- The repaired Office photograph loaded through the local Next image optimizer; the original upstream URL returned 404 and its corrected ID returned 200.
- Browser enquiry tests intercepted the local request: two simultaneous submit events made one request, and a simulated provider rejection showed the existing error message and unlocked the form. No email was sent.
- The actual service worker registered, controlled the page and served a previously visited Gallery navigation offline.
- HTTP checks passed robots, sitemap, manifest, search, catalog diagnostic and review endpoints. The sitemap includes CMS projects and static/CMS blog URLs. Enquiry validation returned 400, missing delivery configuration returned 503, and the local revalidation endpoint returned 401 without authentication and 200 with its test secret.
- Final production build including lint/type checks passed. `node scripts/verify-stability.cjs` passed enquiry, worker and project-route regression checks. `git diff --check` passed.

## Repairs in this recheck

1. Render Sanity Projects at /projects/[slug] instead of always redirecting to a non-existent case study. Existing case-study aliases still redirect, and unknown slugs show not-found. Detail pages reuse the existing case-study presentation and use project SEO and video data.
2. Add project and blog entries to the sitemap.
3. Allow Office/Hospitality headings and case-study metadata to shrink/wrap inside their existing narrow-screen layout.
4. Keep two article comparison tables scrollable inside their article frame rather than widening the page. Table content, typography and desktop styling remain intact.
5. Correct the broken Office stock-image identifier. Sanity secondary-image overrides retain precedence.

## Remaining release requirements

- Merge and deploy the website and updated Sanity Studio. This audit tested local production builds, not the deployed client domain.
- Verify the configured Resend sender and actual email delivery in the deployment. Credentials were not available for a real delivery test.
- Upload client-approved covers for wardrobes, TV consoles, storage solutions, modular kitchens, wallpapers and doors.
- Sanity contains project titles X, Y and Z; these were preserved rather than deleting client content. The client can rename or remove them in Studio.
- Browser viewport emulation does not replace physical Android/iPhone testing. No Lighthouse performance score or measured Core Web Vitals improvement is claimed.

## Additional full visual and CMS media review

- Scrolled 24 routes fully at 390px and 1440px: 48 page scans. No document overflow or JavaScript exceptions. Non-homepage routes had no broken images. The initial homepage media errors were traced to the test browser's missing proxy configuration; a proxy-aware pass confirmed the SVG logo and all videos loaded. Test-only proxy certificate handling did not alter website security settings.
- Visually inspected viewport captures of the hero, About reels, leadership, furniture, project and contact/solution sections. Tall-page capture artifacts were cross-checked with viewport screenshots and a single visible DOM heading.
- All five Sanity-hosted videos reached a playable state and advanced their playback time at both widths. There were no video errors or broken homepage images in the final pass.
- About-reel posters are actual frames from the client's four existing clips. The hero poster and solution secondary images preserve the prior illustrations. Valid uploaded client images were retained.
- Hero/reel file uploads, poster fields, branding logo, both solution secondary photos and five article illustrations now have Sanity asset references. The article illustration editor is under Article Images; its API serves the existing HTML/CSS templates with the selected image, preserving the article design.
- All four reels were prepared as H.264/yuv420p with fast-start metadata. Their combined size changed from 126,115,577 bytes to 18,649,298 bytes, approximately 85% smaller. The hero stream also has fast-start metadata. The source footage and layout remain the same.
- Category cover/brand/product-association fallback behavior was corrected: clearing CMS fields no longer restores built-in media or product associations. Removed categories no longer reappear through built-in category-route defaults. Tests cover these empty-field cases.
- Website and updated Studio production builds passed. Private write-token scanning of browser assets passed.

The local frontend reads the client's published remote Sanity dataset. Merge and deploy the updated website and Studio to release the new editors and rendering. Six missing category covers still require client-approved photographs. Real email delivery and physical-device performance remain unverified.
