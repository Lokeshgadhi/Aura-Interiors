# Braze Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Braze Web SDK into all 10 HTML pages of the Aura Interiors static site to enable anonymous push notifications and behavior event tracking.

**Architecture:** A single `braze-init.js` file handles SDK initialization, session open, page view tracking, and push permission request. Each HTML page sets `window.BRAZE_PAGE_NAME` inline before loading `braze-init.js`. Event hooks for clicks and form submissions are added to the existing `script.js` alongside the current Google Analytics hooks. A `service-worker.js` at the site root enables browser push delivery.

**Tech Stack:** Braze Web SDK 4.10 (CDN), Vanilla JS, Static HTML, Vercel hosting

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `service-worker.js` | Create | Imports Braze push handler — required at root for push to work |
| `braze-init.js` | Create | SDK init, session open, page_viewed event, push permission request |
| `script.js` | Modify | Add Braze custom event calls alongside existing GA event calls |
| `index.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Home"`, `braze-init.js` |
| `modular-kitchen-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Modular Kitchen"`, `braze-init.js` |
| `wardrobe-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Wardrobe"`, `braze-init.js` |
| `tv-unit-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "TV Unit"`, `braze-init.js` |
| `dining-area-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Dining Area"`, `braze-init.js` |
| `home-interiors-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Home Interiors"`, `braze-init.js` |
| `interior-designers-hyderabad.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Interior Designers"`, `braze-init.js` |
| `interior-designers-gachibowli.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Gachibowli"`, `braze-init.js` |
| `interior-designers-kondapur.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Kondapur"`, `braze-init.js` |
| `interior-designers-kukatpally.html` | Modify | Add SDK script, `BRAZE_PAGE_NAME = "Kukatpally"`, `braze-init.js` |

---

## Task 1: Create service-worker.js

**Files:**
- Create: `service-worker.js`

- [ ] **Step 1: Create the file at the project root**

Create `service-worker.js` with exactly this content:

```js
importScripts("https://js.appboycdn.com/web-sdk/4.10/service-worker.js");
```

- [ ] **Step 2: Verify it is accessible locally**

Start a local server (or open via Vercel preview URL) and navigate to `/service-worker.js` in the browser. You should see the raw JS content — not a 404.

- [ ] **Step 3: Commit**

```bash
git add service-worker.js
git commit -m "feat: add Braze push service worker"
```

---

## Task 2: Create braze-init.js

**Files:**
- Create: `braze-init.js`

> **Before starting:** Get your Web SDK API key from Braze Dashboard → Settings → Developer Console → Identification → "Web SDK API Key". It is NOT the same as the App ID.

- [ ] **Step 1: Create braze-init.js at the project root**

```js
(function () {
  if (typeof braze === 'undefined') return;

  braze.initialize("YOUR_WEB_SDK_API_KEY", {
    baseUrl: "sdk.fra-02.braze.eu",
    serviceWorkerLocation: "/service-worker.js",
    enableLogging: true
  });

  braze.openSession();

  braze.logCustomEvent("page_viewed", {
    page_name: window.BRAZE_PAGE_NAME || document.title,
    page_url: window.location.href
  });

  braze.requestPushPermission();
})();
```

Replace `YOUR_WEB_SDK_API_KEY` with your actual Web SDK API key.

- [ ] **Step 2: Verify the file exists**

```bash
ls braze-init.js
```

Expected: file listed with non-zero size.

- [ ] **Step 3: Commit**

```bash
git add braze-init.js
git commit -m "feat: add Braze SDK init script"
```

---

## Task 3: Add Braze event hooks to script.js

**Files:**
- Modify: `script.js`

The existing `script.js` has GA event hooks at these exact locations (do not remove the GA code — add Braze calls alongside them):
- WhatsApp click: line ~112, inside `document.querySelectorAll('a[href*="wa.me"]').forEach`
- Contact form submit: line ~72, inside `contactForm.addEventListener('submit')`
- No phone or portfolio hooks exist yet — add them as new blocks.

- [ ] **Step 1: Add Braze tracking to the WhatsApp click handler**

Find this block in `script.js` (around line 112):

```js
document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'conversion',
                'event_label': 'WhatsApp Lead'
            });
        }
    });
});
```

Add the Braze call inside the click listener, after the `gtag` block:

```js
document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'conversion',
                'event_label': 'WhatsApp Lead'
            });
        }
        if (typeof braze !== 'undefined') {
            braze.logCustomEvent("whatsapp_clicked", {
                source_page: window.BRAZE_PAGE_NAME || document.title
            });
        }
    });
});
```

- [ ] **Step 2: Add Braze tracking to the contact form submit handler**

Find the `contactForm.addEventListener('submit', ...)` block (around line 72). Add the Braze call right after the `gtag` block inside the submit listener:

```js
contactForm.addEventListener('submit', () => {
    if (typeof gtag === 'function') {
        gtag('event', 'form_submit', {
            'event_category': 'conversion',
            'event_label': 'Contact Form',
            'value': 1,
            'currency': 'INR'
        });
    }
    if (typeof braze !== 'undefined') {
        braze.logCustomEvent("form_submitted", {
            source_page: window.BRAZE_PAGE_NAME || document.title
        });
        var emailField = document.getElementById('contact-email');
        if (emailField && emailField.value) {
            braze.getUser().setEmail(emailField.value);
        }
    }
    // ... rest of existing submit handler (spinner, iframe, etc.) stays unchanged
```

- [ ] **Step 3: Add phone click tracking (new block)**

Add this new block at the end of the `DOMContentLoaded` callback, after the existing WhatsApp block (before the closing `}`):

```js
document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof braze !== 'undefined') {
            braze.logCustomEvent("phone_clicked", {
                source_page: window.BRAZE_PAGE_NAME || document.title
            });
        }
    });
});
```

- [ ] **Step 4: Add portfolio image click tracking (new block)**

Add this block immediately after the phone click block:

```js
document.querySelectorAll('.portfolio-item').forEach(function (item) {
    item.addEventListener('click', function () {
        if (typeof braze !== 'undefined') {
            braze.logCustomEvent("portfolio_viewed", {
                category: window.BRAZE_PAGE_NAME || document.title
            });
        }
    });
});
```

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: add Braze event hooks alongside existing GA tracking"
```

---

## Task 4: Wire up index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the three script tags before `</body>`**

Find the closing `</body>` tag in `index.html`. Add these three lines immediately before it:

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Home";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 2: Open index.html in a browser and verify in the console**

Open browser DevTools → Console. You should see Braze SDK log lines like:
```
Braze: Session opened for user ...
Braze: Logged custom event: page_viewed
```

If you see `Braze: Push permission granted` after allowing the notification prompt, push is working.

- [ ] **Step 3: Verify in Braze dashboard**

Go to: **Braze Dashboard → Analytics → Custom Events**. After ~1 minute, `page_viewed` should appear with 1 event count.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: wire Braze SDK into index.html"
```

---

## Task 5: Wire up the remaining 9 HTML files

**Files:**
- Modify: `modular-kitchen-hyderabad.html`, `wardrobe-hyderabad.html`, `tv-unit-hyderabad.html`, `dining-area-hyderabad.html`, `home-interiors-hyderabad.html`, `interior-designers-hyderabad.html`, `interior-designers-gachibowli.html`, `interior-designers-kondapur.html`, `interior-designers-kukatpally.html`

For each file below, add these three lines immediately before `</body>`, using the exact `BRAZE_PAGE_NAME` value shown:

- [ ] **Step 1: modular-kitchen-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Modular Kitchen";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 2: wardrobe-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Wardrobe";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 3: tv-unit-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "TV Unit";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 4: dining-area-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Dining Area";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 5: home-interiors-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Home Interiors";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 6: interior-designers-hyderabad.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Interior Designers";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 7: interior-designers-gachibowli.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Gachibowli";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 8: interior-designers-kondapur.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Kondapur";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 9: interior-designers-kukatpally.html**

```html
<script src="https://js.appboycdn.com/web-sdk/4.10/braze.min.js"></script>
<script>window.BRAZE_PAGE_NAME = "Kukatpally";</script>
<script src="/braze-init.js"></script>
```

- [ ] **Step 10: Commit all 9 files**

```bash
git add modular-kitchen-hyderabad.html wardrobe-hyderabad.html tv-unit-hyderabad.html dining-area-hyderabad.html home-interiors-hyderabad.html interior-designers-hyderabad.html interior-designers-gachibowli.html interior-designers-kondapur.html interior-designers-kukatpally.html
git commit -m "feat: wire Braze SDK into all remaining HTML pages"
```

---

## Task 6: End-to-end verification

**No files changed — verification only.**

- [ ] **Step 1: Verify page_viewed fires on each page type**

Open the browser console (DevTools → Console) on each of these pages and confirm you see:
```
Braze: Logged custom event: page_viewed {"page_name":"Home","page_url":"..."}
```
Test at minimum: `index.html`, `modular-kitchen-hyderabad.html`, `interior-designers-gachibowli.html`.

- [ ] **Step 2: Verify WhatsApp click event**

Click any WhatsApp button on the site. Console should show:
```
Braze: Logged custom event: whatsapp_clicked {"source_page":"Home"}
```

- [ ] **Step 3: Verify phone click event**

Click any phone (`tel:`) link. Console should show:
```
Braze: Logged custom event: phone_clicked {"source_page":"Home"}
```

- [ ] **Step 4: Verify form submission event**

Fill in and submit the contact form on `index.html`. Console should show:
```
Braze: Logged custom event: form_submitted {"source_page":"Home"}
Braze: Set email attribute: ...
```

- [ ] **Step 5: Verify portfolio click event**

Click any `.portfolio-item` on `index.html`. Console should show:
```
Braze: Logged custom event: portfolio_viewed {"category":"Home"}
```

- [ ] **Step 6: Verify events appear in Braze dashboard**

Go to: **Braze Dashboard → Analytics → Custom Events**

Confirm these events appear:
- `page_viewed`
- `whatsapp_clicked`
- `phone_clicked`
- `form_submitted`
- `portfolio_viewed`

- [ ] **Step 7: Verify push subscriber in Braze**

Go to: **Braze Dashboard → Audience → Segments** (or check your test user profile).

After allowing push in the browser, navigate to **Braze Dashboard → Users → User Search** and search by device/browser. Confirm the push token is registered.

- [ ] **Step 8: Final commit note**

No code changes in this task. If all steps above pass, the integration is complete and ready for campaign setup in the Braze dashboard.
