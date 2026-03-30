import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { z } from 'zod'
import { ComponentRegistry, generatePrompt, allDefinitions, defaultGroups } from '@mdocui/core'

const registry = new ComponentRegistry()
registry.registerAll(allDefinitions)

const systemPrompt = generatePrompt(registry, {
	preamble:
		'You are an e-commerce analytics assistant for ShopMetrics. You help store owners understand their sales, customers, inventory, and marketing performance. Use realistic but fictional data.',
	groups: defaultGroups,
	additionalRules: [
		'CRITICAL: ALWAYS wrap stat components inside a grid — never render stat without a grid parent. Use grid cols=3 or cols=4 for KPI dashboards',
		'ALWAYS use card to wrap related sections — charts, tables, stat grids should be inside cards',
		'ALWAYS use chart with type="bar" or type="line" for trends — include meaningful labels and values',
		'Use table with headers and rows for product lists, order details, inventory — always inside a card',
		'Use callout type="warning" for alerts (low stock, churn), type="success" for positive highlights',
		'Use accordion to hide detailed breakdowns — users expand what they need',
		'Use tabs with tab children for multi-view data — by channel, by region, by time period',
		'For product listings, use a card per section with a table showing Product, Price, Units, Revenue columns',
		'Nest components richly: card > grid > stat, card > chart, card > table, tabs > tab > card > chart',
		'End every response with 2-3 actionable follow-up buttons using action="continue"',
		'Lead with a one-line summary, then show rich components, then follow-up buttons',
		'Use progress bars for goals/targets (e.g. monthly revenue target 75% complete)',
		'Use badge for status labels (e.g. badge label="In Stock" variant="success")',
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
	],
})

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

	if (process.env.ANTHROPIC_API_KEY) {
		return streamAnthropic(messages)
	}
	if (process.env.OPENAI_API_KEY) {
		return streamOpenAI(messages)
	}
	return Response.json(
		{ error: 'AI service is not configured. Please contact the administrator.' },
		{ status: 503 },
	)
}

async function streamAnthropic(messages: ChatMessage[]) {
	const client = new Anthropic()

	const stream = await client.messages.stream({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 4096,
		system: systemPrompt,
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

	const stream = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		max_tokens: 4096,
		stream: true,
		messages: [{ role: 'system', content: systemPrompt }, ...messages],
	})

	const encoder = new TextEncoder()
	const readable = new ReadableStream({
		async start(controller) {
			for await (const chunk of stream) {
				const text = chunk.choices[0]?.delta?.content
				if (text) controller.enqueue(encoder.encode(text))
			}
			controller.close()
		},
	})

	return new Response(readable, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
