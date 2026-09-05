'use client'

/**
 * Shared mdocUI primitives: registry, classNames, prose renderer.
 * Import from here so every part of the app uses the same configuration.
 */

import { ComponentRegistry, allDefinitions } from '@mdocui/core'
import { SimpleMarkdown } from '@mdocui/react'
import type { ComponentErrorEvent } from '@mdocui/react'

// ── Registry ────────────────────────────────────────────────────────────────
// coerce: true turns on LLM-friendly mode.
// When strict Zod validation fails (e.g. LLM sends "Up" instead of "up"),
// the registry falls back to raw props instead of dropping the component.
export const registry = new ComponentRegistry({ coerce: true })
registry.registerAll(allDefinitions)

// ── classNames ──────────────────────────────────────────────────────────────
// Tailwind overrides for default component inline styles.
// When a className is provided, the component drops its decorative inline
// styles so CSS classes have full control via data-mdocui-* selectors.
export const rendererClassNames: Record<string, string> = {
	button:
		'px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-medium ' +
		'hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ' +
		'disabled:opacity-40 disabled:cursor-not-allowed',
}

// ── Prose renderer ──────────────────────────────────────────────────────────
export function renderProse(text: string, key: string) {
	if (!text.trim()) return null
	return (
		<div key={key} className="leading-relaxed [&>*]:mb-2">
			<SimpleMarkdown content={text} dataKey={key} />
		</div>
	)
}

// ── Component errors ────────────────────────────────────────────────────────
// A component that throws is caught per-component, so the rest of the message
// still renders. In production this is where you would report to Sentry or
// similar; the props are included because a model sending an unexpected shape
// is the usual cause.
export function handleComponentError({ componentName, error, props }: ComponentErrorEvent) {
	console.error(`[mdocui] <${componentName}> failed to render:`, error.message, props)
}
