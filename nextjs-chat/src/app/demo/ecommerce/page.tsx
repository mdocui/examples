'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MdocMessage } from '../../mdoc-message'

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
}

const suggestions = [
	{ label: "Today's dashboard", icon: '📊' },
	{ label: 'Top selling products this month', icon: '🏆' },
	{ label: 'Customer retention analysis', icon: '👥' },
	{ label: 'Inventory alerts', icon: '📦' },
	{ label: 'Revenue by channel breakdown', icon: '💰' },
]

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)
	const messagesRef = useRef<Message[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		messagesRef.current = messages
	}, [messages])

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

			const allMessages = [...messagesRef.current, userMsg].map(({ role, content }) => ({ role, content }))

			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: allMessages }),
				})

				if (!res.ok) {
					const errorBody = await res.json().catch(() => null)
					throw new Error(errorBody?.error ?? `Request failed (${res.status})`)
				}
				if (!res.body) throw new Error('No response stream')

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
				const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
				setMessages((prev) =>
					prev.map((m) =>
						m.id === assistantMsg.id ? { ...m, content: `**Error:** ${errorMessage}` } : m,
					),
				)
			}

			setIsLoading(false)
			inputRef.current?.focus()
		},
		[],
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

	const isEmpty = messages.length === 0

	return (
		<div className="h-[calc(100vh-3.5rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950">
			{/* Header */}
			<div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
				<div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
							S
						</div>
						<div>
							<h1 className="text-sm font-semibold">ShopMetrics</h1>
							<p className="text-zinc-400 dark:text-zinc-600 text-[11px]">E-commerce Analytics</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						{!isEmpty && (
							<button
								type="button"
								onClick={() => { setMessages([]); setInput(''); setIsLoading(false) }}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M12 20h9" />
									<path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
								</svg>
								New chat
							</button>
						)}
						<a
							href="https://github.com/mdocui/mdocui"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="https://img.shields.io/github/stars/mdocui/mdocui?style=social"
								alt="GitHub stars"
								className="h-5"
							/>
						</a>
						<a
							href="https://www.npmjs.com/package/@mdocui/core"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="https://img.shields.io/npm/v/@mdocui/core?label=npm&color=blue"
								alt="npm version"
								className="h-5"
							/>
						</a>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
				<div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
					{isEmpty && (
						<div className="flex flex-col items-center justify-center py-24 text-center">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
								S
							</div>
							<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
								Welcome to ShopMetrics
							</h2>
							<p className="text-zinc-500 dark:text-zinc-500 text-sm max-w-md">
								Ask me anything about your store — revenue, products, customers, inventory. I'll respond with rich interactive dashboards.
							</p>
						</div>
					)}

					{messages.map((msg) => {
						const isLast = msg.id === messages[messages.length - 1]?.id
						const isStreamingThis = isLoading && isLast

						return (
							<div key={msg.id} className="animate-in fade-in">
								{msg.role === 'user' ? (
									<div className="flex justify-end">
										<div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-blue-600 text-white text-sm leading-relaxed shadow-sm">
											{msg.content}
										</div>
									</div>
								) : (
									<div className="flex gap-3">
										<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1 shadow-sm">
											S
										</div>
										<div className="flex-1 min-w-0">
											<div className="rounded-2xl rounded-tl-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
												<MdocMessage
													content={msg.content}
													isStreaming={isStreamingThis}
													onAction={handleAction}
												/>
												{isStreamingThis && (
													<div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800">
														<span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
														<span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:150ms]" />
														<span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:300ms]" />
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>

			{/* Suggestions */}
			{isEmpty && (
				<div className="max-w-3xl mx-auto px-6 pb-3 w-full">
					<div className="flex flex-wrap gap-2 justify-center">
						{suggestions.map(({ label, icon }) => (
							<button
								key={label}
								type="button"
								onClick={() => sendMessage(label)}
								disabled={isLoading}
								className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer disabled:opacity-50 shadow-sm hover:shadow"
							>
								<span>{icon}</span>
								<span>{label}</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Input */}
			<div className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
				<div className="max-w-3xl mx-auto px-6">
					<form onSubmit={handleSubmit} className="flex items-center gap-3 py-3">
						<input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask about your store..."
							disabled={isLoading}
							className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 placeholder:text-zinc-400"
						/>
						<button
							type="submit"
							disabled={isLoading || !input.trim()}
							className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="22" y1="2" x2="11" y2="13" />
								<polygon points="22 2 15 22 11 13 2 9 22 2" />
							</svg>
						</button>
					</form>
					<p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 pb-2">
						Powered by{' '}
						<a href="https://github.com/mdocui/mdocui" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
							mdocUI
						</a>
						{' '}&middot;{' '}
						<a href="https://mdocui.github.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
							Documentation
						</a>
						{' '}&middot;{' '}
						<a href="https://www.npmjs.com/org/mdocui" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
							npm
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}
