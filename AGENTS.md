# AGENTS.md — mdocUI Examples

## Structure

- `nextjs-chat/` — ShopMetrics: e-commerce analytics demo with Next.js 16

## Running

```bash
cd nextjs-chat
cp .env.example .env.local  # add API key
pnpm install
pnpm dev
```

## Key files

- `src/app/api/chat/route.ts` — system prompt + LLM streaming (Zod validated)
- `src/app/mdoc-registry.ts` — 24 component definitions with Zod schemas
- `src/app/mdoc-message.tsx` — StreamingParser + Renderer integration with theme-aware classNames
- `src/app/page.tsx` — chat UI with action handling, theme switcher, streaming indicator
- `src/app/globals.css` — chart/progress color overrides via data-* attributes
- `src/app/theme-provider.tsx` — light/dark theme context with localStorage persistence

## Implementation pattern

1. Define components in registry with Zod schemas (`mdoc-registry.ts`)
2. Call `generatePrompt(registry, options)` to build system prompt — library auto-generates syntax/component docs, app adds domain rules and examples
3. Stream LLM response as `text/plain` using native Anthropic/OpenAI SDK
4. Parse on client with `StreamingParser` from `@mdocui/core`
5. Render with `<Renderer>` + `defaultComponents` + `classNames` for theming
6. Handle actions via `onAction` callback — buttons send follow-up messages, forms submit state

## Publishing

Always use `pnpm publish` not `npm publish` for the library packages. See AGENTS.md in the main repo.

## mdocUI library

- GitHub: https://github.com/mdocui/mdocui
- Skill file: https://github.com/mdocui/mdocui/blob/main/SKILL.md
- npm: https://www.npmjs.com/org/mdocui
- Docs: https://mdocui.github.io
