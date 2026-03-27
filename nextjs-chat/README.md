# mdocUI Next.js Chat Example

Streaming chat UI with interactive mdocUI generative components.

## Stack

- Next.js 16 (App Router)
- React 19
- `@mdocui/core` + `@mdocui/react` 0.2.0
- Native Anthropic SDK or OpenAI SDK (no framework wrappers)

## Setup

```bash
cp .env.example .env.local
# Add your Anthropic or OpenAI API key
pnpm install
pnpm dev
```

Open http://localhost:3000

## How it works

1. **System prompt** is auto-generated from the component registry using `generatePrompt()`
2. **API route** streams LLM response as plain text using native SDKs
3. **Client** feeds chunks into `StreamingParser`, renders via `<Renderer />`
4. **Buttons** fire `onAction` → send follow-up message
5. **Forms** lock after submission, data sent as new message

## Supported providers

Set one key in `.env.local` — the API route auto-detects:

| Provider | Key | Model |
|----------|-----|-------|
| Anthropic | `ANTHROPIC_API_KEY` | claude-haiku-4-5 |
| OpenAI | `OPENAI_API_KEY` | gpt-4o-mini |
