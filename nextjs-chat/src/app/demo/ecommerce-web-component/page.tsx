'use client'

// Same demo as /demo/ecommerce, but <mdoc-ui> does the rendering. Nothing
// below the send button is a React component.

import { useCallback, useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
	'Show me Q4 revenue by month',
	'Top selling products this month',
	'How is churn trending?',
]

interface MdocUIElement extends HTMLElement {
	push(chunk: string): void
	done(): void
	reset(): void
	classNames: Record<string, string>
}

export default function WebComponentDemo() {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [ready, setReady] = useState(false)
	const [lastAction, setLastAction] = useState<string | null>(null)
	const hostRef = useRef<MdocUIElement | null>(null)

	useEffect(() => {
		import('@mdocui/web-components').then(() => setReady(true))
	}, [])

	useEffect(() => {
		const host = hostRef.current
		if (!host) return

		const onAction = (e: Event) => {
			const detail = (e as CustomEvent).detail
			setLastAction(`${detail.type}: ${detail.label ?? detail.action}`)
			if (detail.type === 'button_click' && detail.action === 'continue' && detail.label) {
				send(detail.label)
			}
		}
		const onError = (e: Event) => {
			const detail = (e as CustomEvent).detail
			console.error('[mdocui]', detail.componentName, detail.error)
		}

		host.addEventListener('mdocui:action', onAction)
		host.addEventListener('mdocui:error', onError)
		return () => {
			host.removeEventListener('mdocui:action', onAction)
			host.removeEventListener('mdocui:error', onError)
		}
	})

	const send = useCallback(async (content: string) => {
		const host = hostRef.current
		if (!content.trim() || !host || loading) return

		setInput('')
		setError(null)
		setLoading(true)
		host.reset()

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: [{ role: 'user', content }] }),
			})
			if (!res.ok) {
				const body = await res.json().catch(() => null)
				throw new Error(body?.error ?? `Request failed (${res.status})`)
			}
			if (!res.body) throw new Error('No response stream')

			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const { done, value } = await reader.read()
				if (done) break
				host.push(decoder.decode(value, { stream: true }))
			}
			host.done()
		} catch (err) {
			host.done()
			setError(err instanceof Error ? err.message : 'Something went wrong.')
		} finally {
			setLoading(false)
		}
	}, [loading])

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<header className="mb-6">
				<h1 className="text-xl font-semibold">ShopMetrics, rendered by a custom element</h1>
				<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
					Same API route and same markup as{' '}
					<a href="/demo/ecommerce-react" className="underline">the React demo</a>. The output here
					is built by <code>&lt;mdoc-ui&gt;</code> with no React components involved.
				</p>
			</header>

			<div className="flex flex-wrap gap-2 mb-4">
				{SUGGESTIONS.map((s) => (
					<button
						key={s}
						type="button"
						onClick={() => send(s)}
						disabled={loading || !ready}
						className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40"
					>
						{s}
					</button>
				))}
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					send(input)
				}}
				className="flex gap-2 mb-6"
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask about your store"
					disabled={loading || !ready}
					className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
				/>
				<button
					type="submit"
					disabled={loading || !ready || !input.trim()}
					className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40"
				>
					{loading ? 'streaming' : 'Send'}
				</button>
			</form>

			{error && (
				<div className="mb-4 p-3 rounded-lg border border-amber-400/40 text-sm whitespace-pre-wrap">
					{error}
				</div>
			)}

			{lastAction && (
				<p className="text-xs text-zinc-500 mb-3">last event: {lastAction}</p>
			)}

			{/* @ts-expect-error custom element */}
			<mdoc-ui ref={hostRef} className="block" />
		</div>
	)
}
