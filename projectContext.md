# Project Context: Aura Interiors

## 📌 Overview
**Aura Interiors** is a professional interior design website catering to residential (2BHK, 3BHK, Villas) and commercial spaces in **Hyderabad**, India. 

- **Founder**: Lokesh Kumar Gadhi
- **Price Range**: Starting from ₹2.5 Lakhs
- **Primary Locations**: Gachibowli, Kukatpally, Kondapur, Hitech City
- **Live URL**: [aura-interior-app.vercel.app](https://aura-interior-app.vercel.app/)

---

## 🛠️ Tech Stack
- **Frontend**: Standard static web stack
  - **HTML5**: Semantic layout & page structure
  - **CSS3 (Vanilla)**: Custom styling (configured in `style.css`)
  - **JavaScript (Vanilla)**: Interaction management (configured in `script.js`)
- **Typography & Icons**:
  - **Google Fonts**: `Outfit` & `Cormorant Garamond`
  - **FontAwesome**: For UI icons
- **Analytics**: Google Analytics integrated (`G-N0H3NL65C2`)
- **Hosting/Deployment**: Vercel (`.vercel` directories present)

---

## 📂 File Structure Inventory

### 📄 Core Website Documents
| File | Description |
| :--- | :--- |
| `index.html` | **Main Landing Page** containing full service summaries, transformations slider, portfolio previews, testimonials, and contact sheet. |
| `style.css` | Standard ruleset accommodating design consistency. |
| `script.js` | Accommodates mobile layouts sidebar, before/after slider toggle, navigation scrolls, and Google Analytics hooks. |

### 🌍 Local SEO Assets
To maximize local organic traffic, specialized landing templates have been structured for specific zones:
- `interior-designers-gachibowli.html`
- `interior-designers-kondapur.html`
- `interior-designers-kukatpally.html`

### 🛋️ Category/Service Offerings
Hyperlinked blueprints for particular design modules:
- `home-interiors-hyderabad.html`
- `interior-designers-hyderabad.html` *(Commercial/General)*
- `modular-kitchen-hyderabad.html`
- `dining-area-hyderabad.html`
- `tv-unit-hyderabad.html`
- `wardrobe-hyderabad.html`

### 📁 Configs & Sub-Folders
- `.vercel/` / `vercel_ls_output.txt`: Setup relating to Vercel hooks.
- `.env.local`: Key holder file (untracked via `.gitignore`).
- `robots.txt` / `sitemap.xml`: Technical SEO items to enhance search bots rendering.
- **Visual Nodes (Asset Collections)**:
  - `/images/`: Core website images.
  - `/dining-area/`, `/kitchen/`, `/tv-unit/`, `/wardrobe/`: Assets specific to those segment modules.

---

## 🌟 Key Features & Integrations

### 1. UX Enhancements
- **Glassmorphic Navbar**: Transparent at header, gains backdrop blur + opacity fill upon viewport scrolls.
- **Before/After Transformation Slider**: Static CSS weights adjusted using JS range bindings to interactively contrast project renders (`.img-before` & `.img-after`).

### 2. Conversions & Lead Ingestion
- **Floating Contact Panel triggers**: Sticky footer buttons offering immediate redirection to **WhatsApp** (+91 7981058016) or **Core Dialers** (+91 9059072432).
- **Embedded Static Lead Sheets**: HTML sheets mapped targeting an iframe wrapper to bypass backend handlers, syncing via **Google Apps Script** sheet URLs.
