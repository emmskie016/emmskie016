# AdPilot — Web Frontend

Frontend for **AdPilot**, the Meta &amp; Google Ads automation SaaS.

## Two parts

### 1. `prototype/` — HTML UI framework (no build step)
A **self-contained, dependency-free HTML prototype** of the full app — the
"framework first" mockup used to lock down UI/UX before wiring it to a backend.

```bash
# just open it
open web/prototype/index.html        # macOS
xdg-open web/prototype/index.html    # Linux
```

It includes all primary screens with mock data and client-side navigation:
**Dashboard · Campaigns · Creative Studio · Automation · Reports · Connections · Billing**.
Everything (CSS, charts, data, interactions) is inline in `index.html`, so it
renders offline in any browser.

### 2. React app (Vite + TypeScript + Tailwind)
The production frontend scaffold that the prototype's screens get ported into.

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

**Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Recharts,
lucide-react. Design tokens live in `tailwind.config.js`; UI primitives and
shared styles in `src/index.css`.

## Design system
- Brand indigo `#4f46e5`; Meta blue `#1877f2`; Google red `#ea4335`.
- Cards `rounded-2xl` with soft shadow; Inter typeface.
- Light theme, data-dense dashboard layout with a dark sidebar shell.

> Mock data only — no real ad-account credentials or API calls. See
> `docs/ads-automation-saas-plan.md` for the full product plan and
> `docs/AdPilot-Pricing-and-Payment-Guide.pdf` for pricing.
