'use client'

import { useCallback, useRef, useState } from 'react'
import { MdocMessage } from './mdoc-message'

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
		<div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			<header style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px solid #27272a' }}>
				<h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
					mdoc<span style={{ color: '#a1a1aa' }}>UI</span> Chat
				</h1>
				<p style={{ color: '#71717a', fontSize: '0.8rem', marginTop: 4 }}>
					Generative UI powered by Markdoc syntax
				</p>
			</header>

			<div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 0' }}>
				{messages.length === 0 && (
					<div style={{ textAlign: 'center', color: '#52525b', padding: '80px 0' }}>
						<p style={{ fontSize: '1.1rem' }}>Ask me anything.</p>
						<p style={{ fontSize: '0.85rem', marginTop: 8 }}>
							Try a suggestion below or type your own question.
						</p>
					</div>
				)}

				{messages.map((msg) => (
					<div
						key={msg.id}
						style={{
							marginBottom: 16,
							padding: '12px 16px',
							borderRadius: 12,
							background: msg.role === 'user' ? '#1e3a5f' : '#18181b',
							border: msg.role === 'user' ? 'none' : '1px solid #27272a',
						}}
					>
						<div style={{ fontSize: '0.7rem', color: '#71717a', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 0 12px' }}>
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
							style={{
								padding: '6px 14px',
								borderRadius: 20,
								border: '1px solid #27272a',
								background: '#18181b',
								color: '#a1a1aa',
								fontSize: '0.8rem',
								cursor: 'pointer',
							}}
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', gap: 8, padding: '12px 0', borderTop: '1px solid #27272a' }}
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message..."
					disabled={isLoading}
					style={{
						flex: 1,
						padding: '12px 16px',
						borderRadius: 8,
						border: '1px solid #27272a',
						background: '#18181b',
						color: '#fafafa',
						fontSize: '0.95rem',
						outline: 'none',
					}}
				/>
				<button
					type="submit"
					disabled={isLoading || !input.trim()}
					style={{
						padding: '12px 24px',
						borderRadius: 8,
						border: 'none',
						background: '#3b82f6',
						color: '#fff',
						fontSize: '0.95rem',
						cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
						opacity: isLoading || !input.trim() ? 0.5 : 1,
					}}
				>
					Send
				</button>
			</form>
		</div>
	)
}
