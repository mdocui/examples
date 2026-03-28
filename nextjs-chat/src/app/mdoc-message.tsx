'use client'

import { useMemo } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, defaultComponents, createDefaultRegistry } from '@mdocui/react'
import type { ActionEvent } from '@mdocui/core'
import ReactMarkdown from 'react-markdown'
import { useTheme } from './theme-provider'

const registry = createDefaultRegistry()
const knownTags = registry.knownTags()

const lightClassNames: Record<string, string> = {
	button: 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-700',
	card: 'border-zinc-200',
	callout: 'border-l-blue-500 bg-blue-50',
	badge: 'border-zinc-300',
	divider: 'border-zinc-200',
	link: 'text-blue-600 hover:text-blue-700',
	input: 'bg-white border-zinc-300',
	textarea: 'bg-white border-zinc-300',
	select: 'bg-white border-zinc-300',
}

const darkClassNames: Record<string, string> = {
	button: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
	card: 'border-zinc-700',
	callout: 'border-l-blue-500 bg-blue-500/10',
	badge: 'border-zinc-600',
	divider: 'border-zinc-700',
	link: 'text-blue-400 hover:text-blue-300',
	input: 'bg-zinc-900 border-zinc-700 text-zinc-100',
	textarea: 'bg-zinc-900 border-zinc-700 text-zinc-100',
	select: 'bg-zinc-900 border-zinc-700 text-zinc-100',
}

interface MdocMessageProps {
	content: string
	isStreaming: boolean
	onAction: (event: ActionEvent) => void
}

export function MdocMessage({ content, isStreaming, onAction }: MdocMessageProps) {
	const { theme } = useTheme()

	const nodes = useMemo(() => {
		const parser = new StreamingParser({ knownTags })
		parser.write(content)
		if (!isStreaming) parser.flush()
		return parser.getNodes()
	}, [content, isStreaming])

	return (
		<Renderer
			nodes={nodes}
			components={defaultComponents}
			classNames={theme === 'dark' ? darkClassNames : lightClassNames}
			isStreaming={isStreaming}
			onAction={onAction}
			renderProse={(text, key) => (
				<div key={key} className="leading-relaxed [&>*]:mb-2">
					<ReactMarkdown>{text}</ReactMarkdown>
				</div>
			)}
		/>
	)
}
