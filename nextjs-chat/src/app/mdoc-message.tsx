'use client'

import { useMemo } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, defaultComponents, createDefaultRegistry, SimpleMarkdown } from '@mdocui/react'
import type { ActionEvent } from '@mdocui/core'

const registry = createDefaultRegistry()
const knownTags = registry.knownTags()

// Ensure headings and list items are separated by blank lines for SimpleMarkdown
function normalizeMarkdown(text: string): string {
	return text
		.replace(/([^\n])\n(#{1,3}\s)/g, '$1\n\n$2')   // blank line before headings
		.replace(/(#{1,3}\s.+)\n([^#\n])/g, '$1\n\n$2') // blank line after headings
		.replace(/([^\n-*])\n(\s*[-*]\s)/g, '$1\n\n$2')  // blank line before list
}

interface MdocMessageProps {
	content: string
	isStreaming: boolean
	onAction: (event: ActionEvent) => void
}

export function MdocMessage({ content, isStreaming, onAction }: MdocMessageProps) {
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
			isStreaming={isStreaming}
			onAction={onAction}
			renderPendingComponent={null}
			renderProse={(text, key) => {
				if (!text.trim()) return null
				return (
					<div key={key} className="leading-relaxed [&>*]:mb-2">
						<SimpleMarkdown content={normalizeMarkdown(text)} dataKey={key} />
					</div>
				)
			}}
		/>
	)
}
