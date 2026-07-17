# FutureMarket — Stock Market of the Future

A 9-page website built on **Zurb Foundation 6.9**, dark-fintech theme. Everything loads from CDN — just open `index.html` in a browser.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, live ticker, the forces reshaping markets, topic links, CTA |
| `about.html` | About — mission, values, company timeline |
| `investing.html` | Investing — fundamentals + future themes (AI, tokenization, robotics…) |
| `personal-finance.html` | Personal Finance — habits + new money tools |
| `retirement.html` | Retirement — planning for a 100-year life |
| `economy.html` | Economy — the macro forces moving markets |
| `contact.html` | Contact — info + validated message form |
| `login.html` | Log in — email + social, validated |
| `create-account.html` | Create account — full sign-up with password-match validation |

Shared: `css/styles.css` (design system) and `js/scripts.js` (behaviour), plus `css/enhance.css` + `js/enhance.js` which add the ten modern-trend features below.

## The 10 trend features (in enhance.css / enhance.js)

All ten are **functional**, load on every page, degrade gracefully, and respect `prefers-reduced-motion`. Because several trends conflict aesthetically (Y2K maximalism vs. minimalism vs. skeuomorphism), the loud ones live behind toggles instead of clashing on screen.

1. **Functional micro-interactions** — scroll-reveal (IntersectionObserver), animated count-up on every stat/bento number, button ripples, tactile press states, animated nav underlines, and subtle 3D card tilt on hover.
2. **Custom performance-driven illustrations** — the market "globe" on Home and all charts are hand-authored inline SVG (a few KB each, CSS-animated), so there are zero raster downloads.
3. **Carbon-aware sustainable design** — a fixed carbon pill estimates the page's CO₂/view from the Performance API. Clicking it (or the agent) enables **Eco mode**, which strips animation, gradients, blur, the ticker and heavy art, and reports a lighter footprint. Choice persists in `localStorage`.
4. **Light skeuomorphism & tactility** — the settings toggles are physical-feeling switches (inset/outset shadows, sprung knob); quick-action chips press in like real buttons.
5. **Dial-up delight & Y2K aesthetics** — a first-visit "connecting… 56000 baud" preloader, plus a togglable **Y2K theme** (starfield, chrome text, ridged bevels, rainbow ticker, "best viewed in Netscape" bar).
6. **Bento grid layout** — the "At a glance" section on Home is an asymmetric bento of varied-size tiles that reflows responsively.
7. **"Barely there" UI & minimalism** — Eco mode doubles as a focus/minimal mode: flat surfaces, no motion, calm palette.
8. **Agentic web experience** — a floating assistant that understands intents: it navigates you ("take me to retirement"), explains concepts, toggles the experience, and reads the page. Quick-action chips included.
9. **Advanced voice UI** — the assistant uses the Web Speech API: tap the mic to **speak** commands (SpeechRecognition), and toggle **spoken replies** (SpeechSynthesis). Hidden gracefully where unsupported.
10. **AI-driven hyper-personalization** — creating an account (or telling the agent "my name is… / set level to beginner") saves a profile to `localStorage`; a personalization banner then greets returning visitors and recommends content matched to their experience level.

Try: refresh Home for the dial-up boot, click the 🌱 pill for eco mode, open the ◆ assistant (bottom-right) and say/type "explain tokenization" or "take me to investing", and flip the Y2K switch in its settings.

## Foundation components used

- **Top Bar + Responsive Toggle** — the sticky nav; collapses to a title-bar burger below the `large` breakpoint.
- **Dropdown Menu** — the "Topics" nav item expands to Investing / Personal Finance / Retirement / Economy. (Those four were grouped under one dropdown to keep the bar clean; each is still a full standalone page and is also linked from the hero, footer, and page CTAs.)
- **XY Grid** — every layout (`grid-x`, `cell`, `medium-6 large-4`, `align-middle`, `align-justify`).
- **Abide** — client-side form validation on the contact, login, create-account, and newsletter forms (required fields, email pattern, password strength via regex, and `data-equalto` for password matching).
- **Callout** — styled alert boxes and the Abide error summaries.
- **Cards** — event/topic panels.

## Design system (in `css/styles.css`)

Dark fintech palette — base `#080B14`, panels `#0F1524`, primary accent mint `#2EE6A6`, secondary cyan `#38BDF8`, plus violet/gold/red for status. Inter typeface. Motifs include an animated ticker, SVG sparkline/area charts, and CSS bar charts — all decorative, no external chart library.

## Notes

- **jQuery + what-input** are included because Foundation 6's JS requires them.
- **Bootstrap Icons** is kept purely as a framework-agnostic icon font; no Bootstrap CSS or JS remains.
- Forms are **front-end only** — they validate and show a success state but submit nowhere. No data is collected or stored. Each auth page states this on-page.
- **Not financial advice:** the content is fictional and educational. Every topic page carries a disclaimer and the footer restates it, since the subject is investing.

## Run it

Open `index.html` directly, or serve the folder:

```
cd stock-market-future
python3 -m http.server 8000   # then visit http://localhost:8000
```
