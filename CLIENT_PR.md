# Make Gallery content editable in Sanity and improve runtime stability

The main Gallery (/projects) still loaded repository photos, and empty category/Residential collections restored local images. These routes now use Sanity images exclusively. Existing main Gallery photos were imported as 68 unique editable images, with uniform frames and CMS ordering.

This also improves stability without redesigning the site: lazy video playback, mobile-menu lifecycle, service-worker isolation and bounded offline caching, correct enquiry delivery errors, duplicate-submit protection and request cleanup.

Validation: production build including lint/types, eight HTTP route checks, worker/enquiry regression checks and DOM menu/video interaction checks passed. Chromium could not be downloaded, so real-browser visual/overflow/performance-score verification remains pending. Email-provider paths were mocked; actual delivery remains to be verified.

Release: deploy website and updated Sanity Studio. Configure and verify Resend delivery. Six category covers still need client-approved photos.
