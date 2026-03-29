'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, createDefaultRegistry } from '@mdocui/react'

const registry = createDefaultRegistry()
const knownTags = registry.knownTags()

const defaultMarkup = `Here are the key metrics for your dashboard:

{% card title="Key Metrics" %}
{% grid cols=3 %}
{% stat label="Revenue" value="$12,482" change="+8.3%" trend="up" /%}
{% stat label="Orders" value="284" change="+12%" trend="up" /%}
{% stat label="Avg Order" value="$43.95" change="-2.1%" trend="down" /%}
{% /grid %}
{% /card %}

{% card title="Weekly Revenue" %}
{% chart type="bar" labels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] values=[1420,1680,1530,1890,2100,2340,1520] title="Daily Revenue" /%}
{% /card %}

{% callout type="info" title="Getting Started" %}
Edit the markup on the left to see it render in real-time. mdocUI uses Markdoc syntax with \`{% tag %}\` delimiters.
{% /callout %}

{% button-group %}
{% button action="continue" label="View Details" variant="primary" /%}
{% button action="continue" label="Export Data" variant="outline" /%}
{% /button-group %}`

export default function Playground() {
	const [content, setContent] = useState(defaultMarkup)
	const [debouncedContent, setDebouncedContent] = useState(defaultMarkup)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleChange = useCallback((value: string) => {
		setContent(value)
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => {
			setDebouncedContent(value)
		}, 200)
	}, [])

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	const { nodes, nodeCount, errors } = useMemo(() => {
		try {
			const parser = new StreamingParser({ knownTags })
			parser.write(debouncedContent)
			parser.flush()
			const parsed = parser.getNodes()
			return { nodes: parsed, nodeCount: parsed.length, errors: 0 }
		} catch {
			return { nodes: [], nodeCount: 0, errors: 1 }
		}
	}, [debouncedContent])

	return (
		<div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
			<div className="flex items-center justify-between px-6 py-2 border-b border-zinc-200 dark:border-zinc-800">
				<div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
					<span>{nodeCount} node{nodeCount !== 1 ? 's' : ''}</span>
					{errors > 0 && (
						<span className="text-red-500 dark:text-red-400">{errors} error{errors !== 1 ? 's' : ''}</span>
					)}
				</div>
			</div>

			<div className="flex-1 min-h-0 flex flex-col md:flex-row">
				<div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
					<div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
						Markup
					</div>
					<textarea
						value={content}
						onChange={(e) => handleChange(e.target.value)}
						spellCheck={false}
						className="flex-1 w-full resize-none bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 text-sm font-mono p-4 outline-none leading-relaxed"
						placeholder="Write mdocUI markup here..."
					/>
				</div>

				<div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
					<div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
						Preview
					</div>
					<div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950">
						{errors > 0 ? (
							<div className="text-red-500 dark:text-red-400 text-sm">Parse error. Check your markup syntax.</div>
						) : (
							<Renderer nodes={nodes} />
						)}
					</div>
				</div>
			</div>

			<div className="px-6 py-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
				<span>Write mdocUI markup and see it render live</span>
				<a
					href="https://mdocui.github.io"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
				>
					Documentation
				</a>
			</div>
		</div>
	)
}
