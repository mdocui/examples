# mdocUI Examples

Example apps demonstrating [mdocUI](https://github.com/mdocui/mdocui) — generative UI for LLMs using Markdoc `{% %}` tag syntax.

## Examples

| Example | Stack | Description |
|---------|-------|-------------|
| [nextjs-chat](./nextjs-chat) | Next.js 16, React 19 | Streaming chat UI with 22 generative components |

## Running

```bash
cd nextjs-chat
cp .env.example .env.local
# Add your API key (Anthropic or OpenAI)
pnpm install
pnpm dev
```

Open http://localhost:3000

## What these examples show

- System prompt auto-generated from component registry
- Streaming LLM output parsed and rendered live
- Charts, tables, stats, callouts, forms inline with prose
- Button clicks send follow-up messages
- Forms lock after submission
- Works with Anthropic Claude or OpenAI GPT
