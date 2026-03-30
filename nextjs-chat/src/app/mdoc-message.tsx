'use client'

import { useMemo } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, defaultComponents, createDefaultRegistry, SimpleMarkdown } from '@mdocui/react'
import type { ActionEvent } from '@mdocui/core'

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
			renderPendingComponent={null}
			renderProse={(text, key) => {
				if (!text.trim()) return null
				return (
					<div key={key} className="leading-relaxed [&>*]:mb-2">
						<SimpleMarkdown content={text} dataKey={key} />
					</div>
				)
			}}
		/>
	)
}
