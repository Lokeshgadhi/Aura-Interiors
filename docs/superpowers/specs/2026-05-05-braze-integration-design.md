# Braze Integration Design — Aura Interiors
Date: 2026-05-05

## Overview

Integrate Braze Web SDK into the Aura Interiors static site to enable push notifications and user behavior tracking. The site is vanilla HTML/CSS/JS hosted on Vercel with no backend or login system.

**Goals:**
- Push notifications: re-engage anonymous visitors via browser push
- Behavior tracking: capture page views, CTA clicks, form submissions, portfolio interactions

**Braze config:**
- Cluster: `sdk.fra-02.braze.eu` (EU-02)
- App ID: `69f863fbf53c290083b18ac4`
- API Key: to be filled from Braze Dashboard → Settings → Developer Console

---

## Architecture

```
[Visitor lands on any page]
        │
        ▼
[braze-init.js loads]
   ├── Initializes Braze SDK (API key + fra-02 endpoint)
   ├── Opens session (anonymous user ID assigned automatically)
   ├── Logs page_viewed event with page name + URL
   └── Requests push permission immediately (on load)
        │
        ▼
[script.js hooks fire on user interactions]
   ├── WhatsApp button click  → logCustomEvent("whatsapp_clicked")
   ├── Phone button click     → logCustomEvent("phone_clicked")
   ├── Form submit            → logCustomEvent("form_submitted") + setEmail()
   └── Portfolio image view   → logCustomEvent("portfolio_viewed", {category})
        │
        ▼
[service-worker.js at root]
   └── Handles push delivery when user is not on site
```

---

## Files

| File | Action | Purpose |
|---|---|---|
| `braze-init.js` | Create | SDK init, session open, push request, page_viewed event |
| `service-worker.js` | Create | Braze push handler (required at site root) |
| `script.js` | Modify | Add Braze event hooks to existing click/form handlers |
| All 9 `.html` files | Modify | Add `<script src="/braze-init.js">` before closing `</body>` |

---

## Event Tracking

| Event Name | Trigger | Properties |
|---|---|---|
| `page_viewed` | Every page load | `page_name`, `page_url` |
| `whatsapp_clicked` | WhatsApp sticky button click | `source_page` |
| `phone_clicked` | Phone sticky button click | `source_page` |
| `form_submitted` | Contact form submit | `source_page` |
| `portfolio_viewed` | Portfolio image clicked | `category` |

### Page Name Mapping

| HTML File | `page_name` |
|---|---|
| `index.html` | `Home` |
| `modular-kitchen-hyderabad.html` | `Modular Kitchen` |
| `wardrobe-hyderabad.html` | `Wardrobe` |
| `tv-unit-hyderabad.html` | `TV Unit` |
| `dining-area-hyderabad.html` | `Dining Area` |
| `home-interiors-hyderabad.html` | `Home Interiors` |
| `interior-designers-hyderabad.html` | `Interior Designers` |
| `interior-designers-gachibowli.html` | `Gachibowli` |
| `interior-designers-kondapur.html` | `Kondapur` |
| `interior-designers-kukatpally.html` | `Kukatpally` |

---

## Push Notifications

- Permission prompt fires automatically on page load via `braze.requestPushPermission()`
- Service worker served from `/service-worker.js` (Vercel root)
- HTTPS required — handled automatically by Vercel
- `enableLogging: true` during testing, remove after

### `braze-init.js` skeleton

```js
braze.initialize("YOUR_API_KEY", {
  baseUrl: "sdk.fra-02.braze.eu",
  serviceWorkerLocation: "/service-worker.js",
  enableLogging: true
});
braze.openSession();
braze.requestPushPermission();
```

### `service-worker.js`

```js
importScripts("https://js.appboycdn.com/web-sdk/4.10/service-worker.js");
```

---

## Anonymous Users

No login system exists. Braze auto-assigns anonymous IDs per browser session. If the contact form captures an email address, call `braze.getUser().setEmail(email)` on form submit to link the anonymous session to a real identity.

---

## Constraints

- Static site — no server-side Braze REST API calls; Web SDK only
- Push requires HTTPS (met by Vercel)
- `enableLogging` must be disabled before production use
- API key must not be committed to a public GitHub repo — use `.env.local` or set after deploy
