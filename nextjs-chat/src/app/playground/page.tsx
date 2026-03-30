'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { StreamingParser } from '@mdocui/core'
import { Renderer, createDefaultRegistry, SimpleMarkdown } from '@mdocui/react'

const registry = createDefaultRegistry()
const knownTags = registry.knownTags()

const defaultMarkup = `## Store Dashboard — March 2026

{% card title="Key Metrics" %}
{% grid cols=4 %}
{% stat label="Revenue" value="$48,290" change="+12.4%" trend="up" /%}
{% stat label="Orders" value="1,284" change="+8%" trend="up" /%}
{% stat label="Customers" value="892" change="+5.2%" trend="up" /%}
{% stat label="Avg Order" value="$37.61" change="-1.8%" trend="down" /%}
{% /grid %}
{% /card %}

{% card title="Revenue Trend" %}
{% chart type="line" labels=["Jan","Feb","Mar","Apr","May","Jun"] values=[32100,28400,35200,41800,39600,48290] title="Monthly Revenue (2026)" /%}
{% /card %}

{% tabs labels=["Top Products","By Channel","Inventory"] %}
{% tab label="Top Products" %}
{% table headers=["Product","Units","Revenue","Margin"] rows=[["Wireless Earbuds Pro",842,"$33,680","42%"],["USB-C Hub 7-in-1",631,"$18,930","38%"],["Laptop Stand",524,"$15,720","45%"],["MagSafe Case",498,"$7,470","52%"],["Screen Protector 3-Pack",412,"$4,120","65%"]] /%}
{% /tab %}
{% tab label="By Channel" %}
{% grid cols=3 %}
{% stat label="Website" value="$28,974" change="+15%" trend="up" /%}
{% stat label="Mobile App" value="$12,072" change="+22%" trend="up" /%}
{% stat label="Marketplace" value="$7,244" change="-3%" trend="down" /%}
{% /grid %}
{% chart type="pie" labels=["Website","Mobile App","Marketplace"] values=[60,25,15] title="Revenue Share %" /%}
{% /tab %}
{% tab label="Inventory" %}
{% table headers=["Product","Stock","Status","Reorder"] rows=[["Wireless Earbuds Pro",124,"OK","No"],["USB-C Hub 7-in-1",18,"Low","Yes"],["Laptop Stand",203,"OK","No"],["MagSafe Case",7,"Critical","Yes"]] /%}
{% callout type="warning" title="Low Stock Alert" %}
2 products need reordering before the weekend rush.
{% /callout %}
{% /tab %}
{% /tabs %}

{% card title="Monthly Target" %}
{% progress value=78 label="Revenue Goal — $62,000" /%}
{% /card %}

{% accordion title="Customer Segments" %}
{% grid cols=2 %}
{% stat label="New Customers" value="234" change="+18%" trend="up" /%}
{% stat label="Returning" value="658" change="+3%" trend="up" /%}
{% /grid %}
{% /accordion %}

{% callout type="success" title="Milestone" %}
You've crossed **$45K monthly revenue** for the first time! {% badge label="New Record" variant="success" /%}
{% /callout %}

{% card title="Quick Actions" %}
{% form name="export" %}
{% select name="report" label="Report Type" options=["Sales Summary","Product Performance","Customer Analytics","Inventory Status"] /%}
{% select name="format" label="Format" options=["PDF","CSV","Excel"] /%}
{% button action="submit:export" label="Export Report" variant="primary" /%}
{% /form %}
{% /card %}

{% button action="continue" label="View full analytics" variant="primary" /%}
{% button action="continue" label="Compare with last month" variant="outline" /%}
{% button action="continue" label="Forecast next quarter" variant="ghost" /%}`

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

	const { nodes, meta, nodeCount, errors } = useMemo(() => {
		try {
			const parser = new StreamingParser({ knownTags })
			parser.write(debouncedContent)
			parser.flush()
			const parsed = parser.getNodes()
			const parseMeta = parser.getMeta()
			return { nodes: parsed, meta: parseMeta, nodeCount: parsed.length, errors: 0 }
		} catch {
			return { nodes: [], meta: { errors: [], nodeCount: 0, isComplete: true }, nodeCount: 0, errors: 1 }
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
							<Renderer
								nodes={nodes}
								registry={registry}
								meta={meta}
								renderProse={(text, key) => {
									if (!text.trim()) return null
									return (
										<div key={key} className="leading-relaxed [&>*]:mb-2">
											<SimpleMarkdown content={text} dataKey={key} />
										</div>
									)
								}}
							/>
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
