# 🏥 Bimal Pathology & Diagnostic Center – Official Website

[![Live Website](https://img.shields.io/badge/Live-Website-0a5c9e?style=for-the-badge&logo=google-chrome)](https://bimalpathology.com.np/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/juction4love/pathology_html)

**Official website** for Bimal Pathology & Diagnostic Center – Bharatpur's trusted diagnostic laboratory located in Bharatpur-7, opposite Cancer Hospital, Chitwan, Nepal.

---

## 📋 About The Project

Bimal Pathology & Diagnostic Center provides accurate clinical laboratory testing, modern automated biochemistry and hematology analyzers, and patient-centered digital reporting.

### Core Website Capabilities:
- 🧪 **Searchable Test Directory** – Client-side filtering across Hematology, Biochemistry, Thyroid, Diabetes, Lipid, Vitamins, Cardiac, Urine, and Serology test panels.
- 📋 **Patient Preparation Guidance** – Practical fasting, medication, and sample collection advice.
- 🔬 **Diagnostic Equipment Showcase** – CounCell 23 Excel (Hematology), CORALAB ACE (Biochemistry), and FIAcheck (Immunoassays).
- 🧭 **Sample Collection Journey** – 6-step visual patient journey from registration to digital report retrieval.
- 📑 **Safe Online Report Portal** – Search report status via Lab ID and registered mobile number with genuine server error boundaries.
- 🖼️ **Facility & Technology Gallery** – Accessible lightbox viewer for laboratory analyzers.
- 📱 **Fully Responsive & Accessible** – Optimized for all mobile, tablet, and desktop screens with WCAG AA compliance.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Structure** | Semantic HTML5 (W3C compliant, accessible landmarks) |
| **Styling** | Native Modern CSS Design System (`assets/css/styles.css`) |
| **Interactivity** | Pure Vanilla JavaScript ES6+ (`assets/js/main.js`, `assets/js/report.js`) |
| **Assets** | Optimized WebP + PNG local images (`assets/images/`) |
| **Icons** | Font Awesome 6 |
| **Typography** | Google Fonts (Inter) |
| **Hosting** | Cloudflare Pages / Static Hosting |

---

## 🗂️ Folder Structure

```
pathology_html/
├── .well-known/
│   └── assetlinks.json       # Android App Links verification
├── assets/
│   ├── css/
│   │   └── styles.css        # Production native CSS design system
│   ├── images/
│   │   ├── coralab_ace.png / .webp
│   │   ├── councell_23_excel.png / .webp
│   │   ├── fiacheck_analyzer.png / .webp
│   │   └── hero-pathology.png / .webp
│   └── js/
│       ├── main.js           # Navigation, search filter, FAQ, lightbox
│       └── report.js         # Safe digital report portal handler
├── _headers                  # Cloudflare Pages security & cache headers
├── _routes.json              # Cloudflare routing rules
├── .gitignore                # Git exclusions
├── index.html                # Main homepage application
├── README.md                 # Project documentation
├── robots.txt                # Search engine crawler directives
├── sitemap.xml               # XML Sitemap
└── wrangler.jsonc            # Cloudflare Workers/Pages configuration
```

---

## 🚀 Local Development & Preview

To run this static project locally:

```bash
# Clone the repository
git clone https://github.com/juction4love/pathology_html.git
cd pathology_html

# Run with any local static web server, e.g.:
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

---

## 🔒 Security & Privacy

- Strict Content-Security-Policy (CSP), `X-Frame-Options`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` configured in `_headers`.
- Zero exposed credentials or private keys.
- Medical disclaimer and patient data privacy notices clearly presented.

---

## 📞 Contact Information

- **Address:** Bharatpur – 7, Opposite Cancer Hospital, Chitwan, Nepal
- **Phone:** 056-593288
- **Email:** admin@bimalpathology.com.np
- **Operating Hours:** 7:00 AM – 8:00 PM (24/7 Emergency Support)
