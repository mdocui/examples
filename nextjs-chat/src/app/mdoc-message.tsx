'use client'

import { useMemo } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, defaultComponents, createDefaultRegistry } from '@mdocui/react'
import type { ActionEvent } from '@mdocui/core'
import ReactMarkdown from 'react-markdown'

const registry = createDefaultRegistry()
const knownTags = registry.knownTags()

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
			renderProse={(text, key) => (
				<div key={key} style={{ lineHeight: 1.7 }}>
					<ReactMarkdown>{text}</ReactMarkdown>
				</div>
			)}
		/>
	)
}
