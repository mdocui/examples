'use client'

import { useCallback, useRef, useState } from 'react'
import { MdocMessage } from './mdoc-message'
import { useTheme } from './theme-provider'

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
}

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)
	const { theme, toggle, mounted } = useTheme()

	const scrollToBottom = () => {
		setTimeout(() => {
			scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
		}, 50)
	}

	const sendMessage = useCallback(
		async (content: string) => {
			const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
			const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }

			setMessages((prev) => [...prev, userMsg, assistantMsg])
			setInput('')
			setIsLoading(true)
			scrollToBottom()

			const allMessages = [...messages, userMsg].map(({ role, content }) => ({ role, content }))

			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: allMessages }),
				})

				if (!res.ok || !res.body) throw new Error('Stream failed')

				const reader = res.body.getReader()
				const decoder = new TextDecoder()
				let accumulated = ''

				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					accumulated += decoder.decode(value, { stream: true })
					const current = accumulated
					setMessages((prev) =>
						prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: current } : m)),
					)
					scrollToBottom()
				}
			} catch (err) {
				console.error('Chat error:', err)
				setMessages((prev) =>
					prev.map((m) =>
						m.id === assistantMsg.id ? { ...m, content: 'Error: Failed to get response.' } : m,
					),
				)
			}

			setIsLoading(false)
		},
		[messages],
	)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || isLoading) return
		sendMessage(input.trim())
	}

	const handleAction = useCallback(
		(event: { action: string; label?: string; formState?: Record<string, unknown>; params?: Record<string, unknown> }) => {
			if (event.action === 'continue' && event.label) {
				sendMessage(event.label)
			} else if (event.action.startsWith('submit:') && event.formState) {
				const summary = Object.entries(event.formState)
					.map(([k, v]) => `${k}: ${v}`)
					.join(', ')
				sendMessage(`Form submitted: ${summary}`)
			} else if (event.action === 'open_url' && event.params?.url) {
				window.open(event.params.url as string, '_blank')
			}
		},
		[sendMessage],
	)

	return (
		<div className="max-w-3xl mx-auto px-6 h-screen flex flex-col overflow-hidden">
			<header className="relative text-center py-4 border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-800">
				<h1 className="text-xl font-semibold">
					mdoc<span className="text-zinc-400 dark:text-zinc-500">UI</span> Chat
				</h1>
				<p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
					Generative UI powered by Markdoc syntax
				</p>
				<button
					type="button"
					onClick={toggle}
					className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500 w-8 h-8 flex items-center justify-center"
					aria-label="Toggle theme"
				>
					{mounted ? (theme === 'dark' ? '☀️' : '🌙') : ''}
				</button>
			</header>

			<div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-6 space-y-4">
				{messages.length === 0 && (
					<div className="text-center text-zinc-600 py-20">
						<p className="text-lg">Ask me anything.</p>
						<p className="text-sm mt-2">Try a suggestion below or type your own question.</p>
					</div>
				)}

				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`p-4 rounded-xl ${
							msg.role === 'user'
								? 'bg-blue-950/50 ml-12'
								: 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
						}`}
					>
						<div className="text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-wider">
							{msg.role === 'user' ? 'You' : 'Assistant'}
						</div>
						{msg.role === 'user' ? (
							<div>{msg.content}</div>
						) : (
							<MdocMessage
								content={msg.content}
								isStreaming={isLoading && msg.id === messages[messages.length - 1]?.id}
								onAction={handleAction}
							/>
						)}
					</div>
				))}
			</div>

			{messages.length === 0 && (
				<div className="flex flex-wrap gap-2 pb-3">
					{[
						'Show me Q4 revenue trends',
						'Compare React vs Vue vs Svelte',
						'Create a contact form',
						'Explain microservices architecture',
						'Top 5 programming languages 2026',
					].map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => sendMessage(suggestion)}
							disabled={isLoading}
							className="px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 text-xs hover:border-blue-500 transition-colors cursor-pointer disabled:opacity-50"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex gap-2 py-3 border-t border-zinc-200 dark:border-zinc-800">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message..."
					disabled={isLoading}
					className="flex-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={isLoading || !input.trim()}
					className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Send
				</button>
			</form>
		</div>
	)
}
