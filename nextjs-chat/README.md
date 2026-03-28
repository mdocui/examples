# mdocUI ShopMetrics — E-commerce Analytics Demo

[![npm core](https://img.shields.io/npm/v/@mdocui/core?label=%40mdocui%2Fcore&color=blue)](https://www.npmjs.com/package/@mdocui/core)
[![npm react](https://img.shields.io/npm/v/@mdocui/react?label=%40mdocui%2Freact&color=blue)](https://www.npmjs.com/package/@mdocui/react)
[![GitHub](https://img.shields.io/github/stars/mdocui/mdocui?style=social)](https://github.com/mdocui/mdocui)

An e-commerce analytics chat assistant that streams interactive dashboards, charts, tables, and KPIs using [mdocUI](https://github.com/mdocui/mdocui) generative UI components.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind v4](https://tailwindcss.com/)
- [`@mdocui/core`](https://www.npmjs.com/package/@mdocui/core) — streaming parser, component registry, prompt generator
- [`@mdocui/react`](https://www.npmjs.com/package/@mdocui/react) — 24 theme-neutral components, Renderer, useRenderer hook
- Native [Anthropic SDK](https://www.npmjs.com/package/@anthropic-ai/sdk) or [OpenAI SDK](https://www.npmjs.com/package/openai)

## Setup

```bash
cp .env.example .env.local
# Add your Anthropic or OpenAI API key
pnpm install
pnpm dev
```

Open http://localhost:3000

## What it demonstrates

- **Nested composition** — `card > grid > stat` for KPI dashboards
- **Multi-view data** — `tabs > tab` with tables and charts inside
- **Data visualization** — charts, tables, stats, progress bars
- **Alerts** — callouts for low stock, churn risk, anomalies
- **Interactivity** — buttons for drill-down, forms for filters
- **Theme switching** — light/dark mode via Tailwind `classNames`
- **Prompt merging** — library auto-generates syntax/component docs, app adds domain rules

## Try these queries

- "Show me today's dashboard"
- "Top selling products this month"
- "Customer retention analysis"
- "Inventory alerts"
- "Revenue by channel breakdown"

## Supported providers

| Provider | Key | Model |
|----------|-----|-------|
| Anthropic | `ANTHROPIC_API_KEY` | claude-haiku-4-5 |
| OpenAI | `OPENAI_API_KEY` | gpt-4o-mini |

## Links

- [mdocUI GitHub](https://github.com/mdocui/mdocui)
- [mdocUI Documentation](https://mdocui.github.io)
- [@mdocui/core on npm](https://www.npmjs.com/package/@mdocui/core)
- [@mdocui/react on npm](https://www.npmjs.com/package/@mdocui/react)
- [@mdocui/cli on npm](https://www.npmjs.com/package/@mdocui/cli)
