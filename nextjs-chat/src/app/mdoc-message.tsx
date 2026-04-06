'use client'

/**
 * MdocMessage — renders a completed assistant message.
 * Parsed once per content value via useMemo; useRenderer is for the live pane.
 */

import { useMemo } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, defaultComponents } from '@mdocui/react'
import type { ActionEvent } from '@mdocui/core'
import { registry, rendererClassNames, renderProse } from '@/lib/mdocui'

const knownTags = registry.knownTags()

interface MdocMessageProps {
	content: string
	onAction: (event: ActionEvent) => void
}

export function MdocMessage({ content, onAction }: MdocMessageProps) {
	const nodes = useMemo(() => {
		const parser = new StreamingParser({ knownTags })
		parser.write(content)
		parser.flush()
		return parser.getNodes()
	}, [content])

	return (
		<Renderer
			nodes={nodes}
			components={defaultComponents}
			isStreaming={false}
			onAction={onAction}
			classNames={rendererClassNames}
			renderPendingComponent={null}
			renderProse={renderProse}
		/>
	)
}
