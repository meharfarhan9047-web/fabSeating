# Make Gallery content editable in Sanity and improve runtime stability

The main Gallery (/projects) still loaded repository photos, and empty category/Residential collections restored local images. These routes now use Sanity images exclusively. Existing main Gallery photos were imported as 68 unique editable images, with uniform frames and CMS ordering.

This also improves stability without redesigning the site: lazy video playback, mobile-menu lifecycle, service-worker isolation and bounded offline caching, correct enquiry delivery errors, duplicate-submit protection and request cleanup.

Validation: production build including lint/types, eight HTTP route checks, worker/enquiry regression checks and DOM menu/video interaction checks passed. Packaged Chromium enabled real-browser testing: 132 broad viewport checks and 32 targeted checks after repairs, plus form and offline-worker interactions. Physical-device and performance-score verification remain pending. Email-provider paths were mocked; actual delivery remains to be verified.

Release: deploy website and updated Sanity Studio. Configure and verify Resend delivery. Six category covers still need client-approved photos.

The recheck also restores Sanity project detail pages instead of redirecting them to missing case studies, adds project/blog sitemap entries, repairs a broken Office stock-image URL and fixes narrow-screen heading, location-label and article-table overflow without redesigning the site.

Final recheck evidence is in RECHECK_REPORT.md, including actual browser thumbnail, menu, offline-worker and form checks. All 68 Gallery photos were verified against live Sanity order. The corrected Office image was verified through the Next optimizer.

Additional media review: homepage hero/reels, posters, logo, solution secondary images and five article illustrations now use Sanity assets. The four reels are approximately 85% smaller combined with compatible fast-start playback. Full-page scans and proxy-aware playback checks passed on mobile/desktop. Empty CMS covers/brands/associations no longer restore built-in defaults. See RECHECK_REPORT.md for evidence and release limits.
