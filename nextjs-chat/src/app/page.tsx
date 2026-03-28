'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
	const messagesRef = useRef<Message[]>([])
	const { theme, toggle, mounted } = useTheme()

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
			} catch {
				setMessages((prev) =>
					prev.map((m) =>
						m.id === assistantMsg.id ? { ...m, content: 'Something went wrong. Please try again.' } : m,
					),
				)
			}

			setIsLoading(false)
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

	return (
		<div className="max-w-3xl mx-auto px-6 h-screen flex flex-col overflow-hidden">
			<header className="relative flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-800">
				<div>
					<h1 className="text-xl font-semibold">
						mdoc<span className="text-zinc-400 dark:text-zinc-500">UI</span>{' '}
						<span className="text-zinc-400 dark:text-zinc-500 font-normal">ShopMetrics</span>
					</h1>
					<p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">E-commerce Analytics Demo</p>
				</div>
				<div className="flex items-center gap-3">
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
					<button
						type="button"
						onClick={toggle}
						className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500 w-8 h-8 flex items-center justify-center"
						aria-label="Toggle theme"
					>
						{mounted ? (theme === 'dark' ? '☀️' : '🌙') : ''}
					</button>
				</div>
			</header>

			<div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-6 space-y-4">
				{messages.length === 0 && (
					<div className="text-center text-zinc-500 dark:text-zinc-600 py-20">
						<p className="text-lg">Ask me anything about your store.</p>
						<p className="text-sm mt-2">Try a suggestion below or type your own question.</p>
					</div>
				)}

				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`p-4 rounded-xl ${
							msg.role === 'user'
								? 'bg-blue-50 dark:bg-blue-950/50 ml-12'
								: 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
						}`}
					>
						<div className="text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-wider">
							{msg.role === 'user' ? 'You' : 'Assistant'}
						</div>
						{msg.role === 'user' ? (
							<div>{msg.content}</div>
						) : (
							<>
								<MdocMessage
									content={msg.content}
									isStreaming={isLoading && msg.id === messages[messages.length - 1]?.id}
									onAction={handleAction}
								/>
								{isLoading && msg.id === messages[messages.length - 1]?.id && (
									<div className="flex items-center gap-1 mt-2 text-zinc-400">
										<span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
										<span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
										<span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>

			{messages.length === 0 && (
				<div className="flex flex-wrap gap-2 pb-3">
					{[
						"Show me today's dashboard",
						'Top selling products this month',
						'Customer retention analysis',
						'Inventory alerts',
						'Revenue by channel breakdown',
					].map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => sendMessage(suggestion)}
							disabled={isLoading}
							className="px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-xs hover:border-blue-500 transition-colors cursor-pointer disabled:opacity-50"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			<div className="border-t border-zinc-200 dark:border-zinc-800">
				<form onSubmit={handleSubmit} className="flex gap-2 py-3">
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
				<p className="text-center text-[10px] text-zinc-400 pb-2">
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
	)
}
