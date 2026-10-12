> Updated CMS/gallery behavior and release steps: see [FABSEATING_COMPLETION.md](./FABSEATING_COMPLETION.md).

# What's Actually Editable from Sanity Studio

## 🔄 Still seeing the old Studio? (No Homepage, Contact Page, Team, Case Studies?)

- **Option A – Use Studio locally (recommended):** From the project root run:
  ```bash
  npm run studio
  ```
  Open the URL it prints (e.g. http://localhost:3333). You’ll see **all** the new types (Homepage, Contact Page, Team, Case Studies, etc.) because it uses your current code.

- **Option B – Update the hosted Studio (e.g. fabseating.sanity.studio):**
  1. In a terminal: `cd sanity/fabseating-website` then `npm run build` then `npm run deploy`.
  2. When it asks **“Select existing studio hostname”**, use the arrow keys to select **fabseating** and press **Enter**.
  3. After deploy finishes, do a **hard refresh** (Ctrl+Shift+R) or open the Studio in an **incognito/private** window so you don’t see a cached old version.

---

## 🌐 Instant updates on the live site (publish in Sanity → see changes on real site)

- **Localhost** already shows new content when you refresh. For the **live site** (your real URL, e.g. Vercel), content updates **instantly** after you publish in Sanity **only if** you add a webhook that points to that live URL.

**One-time setup:** See **[WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)** for step-by-step instructions. In short:

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**.
2. Set **URL** to `https://YOUR-LIVE-DOMAIN.com/api/sanity-webhook` (use your **real live domain**, not localhost).
3. Trigger: **Create**, **Update**, **Delete**. Dataset: **production**. Save.
4. After you deploy your site, every **Publish** in Studio will revalidate the live site within seconds.

---

## ✅ **EDITABLE FROM SANITY STUDIO** (These WILL work)

### **Homepage** (single document: “Homepage” in Studio)
- **Hero background image** – optional; used as fallback if no video.
- **About section – video reels (4 items)** – each: Video URL + Poster/thumbnail image. Edit or upload new images; they appear on the homepage in real time.
- **Our Solutions – 3 cards** – each: Title, Description, Link, Poster image, Video URL. Change images or text and the site updates.
- **Process steps (typewriter strip)** – list of strings (e.g. Consultation, Design & Selection, …). Edit the list to change the rotating text.

### **Contact Page** (single document: “Contact Page” in Studio)
- **Craft strip images (3 images)** – the three images below the contact title (e.g. carpentry, upholstery, finishing). Upload or replace; they reflect on the site as soon as you publish.

### **Team** (documents under “Team” in Studio)
- **Team members** – Name, Role, Short bio, Photo, Social links. Add/edit/remove members; the Team section on the homepage uses this list. If none exist, the site falls back to placeholder content.

### **Site Settings** (single document)
- **Logo image** – optional. If set, it’s used in the header and footer instead of `/logo.png`. Upload or change the logo here to see it site-wide.

### 1. **Product Categories** (`productCategory`)
- **Where it appears:** Homepage (was removed but can be re-added)
- **Editable fields:**
  - Title (e.g., "Sofas", "Chairs", "Tables")
  - Slug
  - Description
  - Image
- **How to edit:** Go to Sanity Studio → Product Category → Create/Edit

### 2. **Case Studies** (`caseStudy`) ⭐ MOST IMPORTANT
- **Where it appears:** Homepage "Our Work" section (shows latest 3)
- **Editable fields:**
  - Title, Subtitle, Summary
  - Hero Image
  - Client Name, Location, Year
  - Industry (Residential/Office/Hospitality/etc.)
  - Story sections (full content)
  - Challenge, Solution, Result
  - Project Statistics
  - Image Gallery
  - Video URL (optional)
  - Products Used (references)
  - Client Testimonial
- **How to edit:** Go to Sanity Studio → Case Study → Create/Edit
- **Note:** Only shows on homepage if you have at least 1 case study created

### 3. **Testimonials** (`testimonial`)
- **Where it appears:** Homepage testimonials section (only if `featured == true`)
- **Editable fields:**
  - Name, Role, Company
  - Content (testimonial text)
  - Image
  - Rating (1-5)
  - Featured (checkbox - MUST be checked to show on homepage)
- **How to edit:** Go to Sanity Studio → Testimonial → Create/Edit → **Check "Featured" box**

### 4. **Projects** (`project`)
- **Where it appears:** `/projects` page
- **Editable fields:**
  - Title, Description
  - Images
  - Location, Year
  - Category (Residential/Office/Hospitality)
  - Furniture Involved (list)
  - Furnishings Involved (list)
  - Featured (boolean)
  - Video URL (optional)
- **How to edit:** Go to Sanity Studio → Project → Create/Edit

### 5. **Blog Posts** (`blogPost`)
- **Where it appears:** Blog pages
- **Editable fields:**
  - Title, Excerpt, Content
  - Featured Image
  - Author (reference)
  - Published Date
- **How to edit:** Go to Sanity Studio → Blog Post → Create/Edit

### 6. **Solution Pages** (`solutionPage`)
- **Where it appears:** `/solutions/residential`, `/solutions/office`, `/solutions/hospitality`
- **Editable fields:**
  - Hero Image
  - Secondary Image
  - Gallery Images
  - SEO fields
- **How to edit:** Go to Sanity Studio → Solution Page → Create/Edit (one per type: residential/office/hospitality)

### 7. **Catalogs** (`catalog`)
- **Where it appears:** `/catalog` page
- **Editable fields:**
  - Title, Description
  - Cover Image
  - Catalog File (PDF)
- **How to edit:** Go to Sanity Studio → **Catalogs** → Create/Edit
- **Important:** After creating or editing a catalog, click **Publish** (top right). Unpublished (draft) catalogs do **not** appear on the site. If you don’t see your catalog, open it in Studio and Publish it, then hard-refresh the site (Ctrl+Shift+R) or wait a few minutes for cache to refresh.

---

## ❌ **NOT EDITABLE FROM SANITY** (Hardcoded - Requires Code Changes)

### Homepage (`app/page.tsx`)

1. **Hero Section:**
   - Headline: "Premium Furniture & Furnishings..."
   - Subheadline: "Since 2001..."
   - CTA Text: "Contact Us"
   - Trust indicators: "Crafted & curated from our Chennai facility..."
   - Brand badges: "Premium Quality", "20+ Years Experience", "Custom Solutions"

2. **Quote Section:**
   - Quote text: "We are the most experienced makers..."
   - Company name: "Fabseating Furniture & Furnishings"

3. **About Section:**
   - Title: "About Fab Seating"
   - Description: "Founded in 2001..."
   - Video URLs: `/videos/video1.mp4`, `/videos/video2.mp4`, etc. (hardcoded paths)

4. **Solutions Section:**
   - All 3 solution cards are HARDCODED:
     - "Residential Collection" - video URL, thumbnail, description
     - "Office Spaces" - video URL, thumbnail, description
     - "Hospitality" - video URL, thumbnail, description
   - **These are NOT editable from Sanity**

5. **Process Typewriter:**
   - Steps: "Consultation", "Design & Selection", etc. (hardcoded array)

6. **Legacy Section:**
   - Stats: "20+ Years", "1000+ Projects", "500+ Clients" (hardcoded)

7. **Custom/Bespoke Section:**
   - All text content is hardcoded

8. **Instagram Link:**
   - URL: `https://instagram.com/fabseating` (hardcoded)

### Footer (`components/Footer.tsx`)

- **All content is hardcoded:**
  - Email: `info@fabseating.com`
  - Phone: `098410 66135`
  - Social links: Instagram, YouTube URLs
  - Footer links (Company, Products, Support)
  - Logo

### Contact Page (`app/contact/page.tsx`)

- **All content is hardcoded:**
  - Email: `info@fabseating.com`
  - Phone: `098410 66135`
  - Address: "428, Kilpauk Garden Road..."
  - All text descriptions

### Site Settings (`siteSettings` schema exists but NOT USED)

- The schema exists but `getSiteSettings()` returns empty/null
- **Nothing from Site Settings actually appears on the site**

---

## 🔧 **HOW TO MAKE THINGS WORK**

### To see Case Studies on Homepage:
1. Go to Sanity Studio
2. Create at least 1 Case Study
3. Fill in: Title, Summary, Hero Image, Industry
4. Save and publish
5. Wait a few minutes (or rebuild site) for changes to appear

### To see Testimonials on Homepage:
1. Go to Sanity Studio
2. Create a Testimonial
3. Fill in: Name, Content, Company
4. **CHECK THE "Featured" CHECKBOX** ⭐
5. Save and publish

### To see Product Categories:
- Currently removed from homepage, but schema exists
- Can be re-added if needed

---

## 🚨 **WHY THINGS DIDN'T WORK**

1. **Case Studies:** You need to CREATE at least 1 case study in Sanity Studio first
2. **Testimonials:** You need to CHECK "Featured" checkbox for them to appear
3. **Product Categories:** Were removed from homepage (but schema exists)
4. **Site Settings:** Schema exists but code doesn't use it - it's not connected
5. **Most homepage content:** Is hardcoded, not from Sanity

---

## 💡 **RECOMMENDATIONS**

If you want more things editable from Sanity:

1. **Create a "Homepage Settings" document** in Sanity with:
   - Hero headline/subheadline
   - Quote text
   - About section text
   - Process steps
   - Stats numbers

2. **Make Solutions section editable** by creating a "Solution Card" document type

3. **Connect Site Settings** to actually display announcement bar, contact info, etc.

4. **Make Footer editable** via Site Settings

Would you like me to implement any of these to make more content editable from Sanity Studio?
