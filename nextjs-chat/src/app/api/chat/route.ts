import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { ComponentRegistry, generatePrompt } from '@mdocui/core'
import { allDefinitions, defaultGroups } from '../../mdoc-registry'

const registry = new ComponentRegistry()
registry.registerAll(allDefinitions)

const systemPrompt = generatePrompt(registry, {
	preamble: 'You are a helpful assistant that provides rich, interactive responses.',
	groups: defaultGroups,
	additionalRules: [
		'Use charts for any numerical data or trends',
		'Use callouts for important warnings or tips',
		'End responses with 2-3 follow-up buttons using action="continue"',
		'Use tables when comparing items',
		'Use stat components for key metrics',
		'Use cards to group related content',
	],
	examples: [
		`Here's how the quarter performed:

{% chart type="bar" labels=["Q1","Q2","Q3","Q4"] values=[120,150,180,210] title="Revenue by Quarter" /%}

Revenue grew steadily, with Q4 being the strongest.

{% callout type="success" title="Highlight" %}
Q4 revenue hit an all-time high of $210M.
{% /callout %}

{% button action="continue" label="Break down by region" /%}
{% button action="continue" label="Compare to last year" /%}`,
	],
})

interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

export async function POST(req: Request) {
	const { messages } = (await req.json()) as { messages: ChatMessage[] }

	if (process.env.ANTHROPIC_API_KEY) {
		return streamAnthropic(messages)
	}
	if (process.env.OPENAI_API_KEY) {
		return streamOpenAI(messages)
	}
	return new Response('No API key configured', { status: 500 })
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
