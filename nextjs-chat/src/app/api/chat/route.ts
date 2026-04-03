import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { z } from 'zod'
import { ComponentRegistry, generatePrompt, allDefinitions, defaultGroups } from '@mdocui/core'

const registry = new ComponentRegistry()
registry.registerAll(allDefinitions)

function buildSystemPrompt() {
	const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	return generatePrompt(registry, {
	preamble:
		`You are ShopMetrics, an e-commerce analytics assistant. Today is ${today}.

<output_contract>
Every response MUST contain ALL of the following sections in this order:
1. One-line summary sentence (plain text)
2. One or more cards with COMPLETE content inside (stats, charts, tables, or prose — NEVER empty cards)
3. Two to three follow-up buttons at the end
</output_contract>

<completeness_contract>
NEVER render an empty component. Every card MUST have content inside it. Every table MUST have rows of data. Every chart MUST have labels and values arrays with real numbers. Every tab MUST have content inside it. If you open a tag, you MUST fill it with data before closing it.
</completeness_contract>

NEVER use HTML tags (<div>, <p>, <b>, <span>, <img>). Use ONLY markdown (**, ##, -, etc.) and {% %} Markdoc tags.

Generate fresh, varied, realistic fictional data for every response. Vary product names, revenue figures, growth percentages, and trends.`,
	groups: defaultGroups,
	additionalRules: [
		'RULE 0 (ABSOLUTE): NEVER output HTML tags. No <div>, <p>, <b>, <span>, <img>, or any HTML. Use ONLY markdown syntax (**, ##, -, etc.) and {% %} Markdoc tags. HTML tags will break the renderer.',
		'RULE 1: Every component MUST contain real data inside it. NEVER output a card, tab, or table with no content. A card with only a title and no body is FORBIDDEN.',
		'RULE 2: ALWAYS wrap stat components inside a grid parent. Use grid cols=3 or cols=4 for stat dashboards.',
		'RULE 3: ALWAYS use card to wrap related sections. Charts, tables, and stat grids go inside cards.',
		'RULE 4: chart MUST include type, labels array, and values array with numeric data.',
		'RULE 5: table MUST include headers array and rows array with actual data rows.',
		'RULE 6: tabs MUST contain tab children, and each tab MUST contain content (cards, charts, tables, or prose).',
		'Use callout type="warning" for alerts, type="success" for positive highlights.',
		'Use accordion to hide detailed breakdowns.',
		'For product browsing queries, render products as cards in a grid cols=3. Each card contains: image tag, bold product name, price and rating line, short description, and a button with the product name in the label.',
		'End every response with 2-3 buttons using action="continue".',
		'Use progress for goals/targets. Use badge for status labels.',
	],
	examples: [
		`Here's your store dashboard for today:

{% card title="Key Metrics" %}
{% grid cols=3 %}
{% stat label="Revenue" value="$12,482" change="+8.3%" trend="up" /%}
{% stat label="Orders" value="284" change="+12%" trend="up" /%}
{% stat label="Avg Order Value" value="$43.95" change="-2.1%" trend="down" /%}
{% /grid %}
{% /card %}

{% chart type="bar" labels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] values=[1420,1680,1530,1890,2100,2340,1520] title="Daily Revenue This Week" /%}

{% callout type="warning" title="Low Stock Alert" %}
3 products are below reorder threshold. Review inventory before the weekend rush.
{% /callout %}

{% button action="continue" label="View low stock items" /%}
{% button action="continue" label="Show top products" /%}
{% button action="continue" label="Customer breakdown" /%}`,

		`Here are your top selling products this month:

{% card title="Product Performance — March 2026" %}
{% table headers=["Product","Units Sold","Revenue","Margin"] rows=[["Wireless Earbuds Pro",842,"$33,680","42%"],["USB-C Hub 7-in-1",631,"$18,930","38%"],["Laptop Stand Aluminum",524,"$15,720","45%"],["Phone Case MagSafe",498,"$7,470","52%"],["Screen Protector Pack",412,"$4,120","65%"]] /%}
{% /card %}

{% accordion title="Revenue Breakdown by Category" %}
{% grid cols=2 %}
{% stat label="Electronics" value="$52,340" change="+15%" trend="up" /%}
{% stat label="Accessories" value="$28,120" change="+8%" trend="up" /%}
{% /grid %}
{% /accordion %}

{% button action="continue" label="Show trending products" /%}
{% button action="continue" label="Inventory status" /%}`,

		`Here are the top running shoes under $200:

{% grid cols=3 %}
{% card %}
{% image src="https://placehold.co/300x200/EBF4FF/3B82F6?text=CloudRunner+Pro" alt="CloudRunner Pro" /%}

**CloudRunner Pro**

**$149.99** · 4.8★ · {% badge label="In Stock" variant="success" /%}

Lightweight mesh upper with responsive cushioning for daily runs.

{% button action="continue" label="View CloudRunner Pro" variant="primary" /%}
{% /card %}
{% card %}
{% image src="https://placehold.co/300x200/EBF4FF/3B82F6?text=TrailBlazer+X" alt="TrailBlazer X" /%}

**TrailBlazer X**

**$179.00** · 4.6★ · {% badge label="Low Stock" variant="warning" /%}

Rugged outsole built for off-road terrain and trail running.

{% button action="continue" label="View TrailBlazer X" variant="primary" /%}
{% /card %}
{% card %}
{% image src="https://placehold.co/300x200/EBF4FF/3B82F6?text=SpeedLite+3" alt="SpeedLite 3" /%}

**SpeedLite 3**

**$189.95** · 4.9★ · {% badge label="In Stock" variant="success" /%}

Carbon plate design for race day performance and speed.

{% button action="continue" label="View SpeedLite 3" variant="primary" /%}
{% /card %}
{% /grid %}

{% button action="continue" label="Filter by brand" variant="outline" /%}
{% button action="continue" label="Sort by price" variant="outline" /%}
{% button action="continue" label="Compare selected" variant="outline" /%}`,
	],
})}

// Validate request body — prevents malformed/oversized input
const BodySchema = z.object({
	messages: z.array(z.object({
		role: z.enum(['user', 'assistant']),
		content: z.string().max(8000),
	})).min(1).max(50),
})

type ChatMessage = z.infer<typeof BodySchema>['messages'][number]

export async function POST(req: Request) {
	const result = BodySchema.safeParse(await req.json())
	if (!result.success) return new Response('Invalid request', { status: 400 })
	const { messages } = result.data

	const noKeyMessage = 'This is a live demo without an API key.\n\nTry the [Playground](/playground) to experiment with mdocUI tags, or clone the [example repo](https://github.com/mdocui/examples) locally to see it in action with your own API key.'

	try {
		if (process.env.ANTHROPIC_API_KEY) {
			return await streamAnthropic(messages)
		}
		if (process.env.OPENAI_API_KEY) {
			return await streamOpenAI(messages)
		}
	} catch (err) {
		console.error('[chat] API error:', err)
		return Response.json({ error: noKeyMessage }, { status: 503 })
	}
	return Response.json({ error: noKeyMessage }, { status: 503 })
}

async function streamAnthropic(messages: ChatMessage[]) {
	const client = new Anthropic()

	const stream = await client.messages.stream({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 4096,
		system: buildSystemPrompt(),
		messages,
	})

	const encoder = new TextEncoder()
	const readable = new ReadableStream({
		async start(controller) {
			for await (const event of stream) {
				if (
					event.type === 'content_block_delta' &&
					event.delta.type === 'text_delta'
				) {
					controller.enqueue(encoder.encode(event.delta.text))
				}
			}
			controller.close()
		},
	})

	return new Response(readable, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}

async function streamOpenAI(messages: ChatMessage[]) {
	const client = new OpenAI()

	const input = messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

	const stream = await client.responses.create({
		model: 'gpt-5.4-nano',
		instructions: buildSystemPrompt(),
		max_output_tokens: 4096,
		stream: true,
		input,
	})

	const encoder = new TextEncoder()
	const readable = new ReadableStream({
		async start(controller) {
			for await (const event of stream) {
				if (event.type === 'response.output_text.delta') {
					controller.enqueue(encoder.encode(event.delta))
				}
			}
			controller.close()
		},
	})

	return new Response(readable, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
