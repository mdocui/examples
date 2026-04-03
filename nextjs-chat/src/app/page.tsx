import Image from 'next/image'
import Link from 'next/link'
import { CopyButton } from './copy-button'

const installCmd = 'pnpm add @mdocui/core @mdocui/react'

const features = [
	{
		title: '24 Components',
		description: 'Layout, interactive, data, and content components out of the box.',
	},
	{
		title: 'Streaming Parser',
		description: 'Character-by-character tokenizer handles partial chunks in real-time.',
	},
	{
		title: 'Zero Config Prose',
		description: 'Built-in markdown rendering. No react-markdown dependency needed.',
	},
	{
		title: 'CLI Scaffolder',
		description: '`npx mdocui init` detects your framework and generates everything.',
	},
	{
		title: 'Error Boundaries',
		description: "One broken component won't crash your chat. Graceful per-component recovery.",
	},
	{
		title: 'Theme Neutral',
		description: 'Components use currentColor/inherit. Your theme, your rules.',
	},
]

const packages = [
	{
		name: '@mdocui/core',
		description: 'Streaming parser, registry, prompt generator',
		badge: 'https://img.shields.io/npm/v/@mdocui/core?color=blue',
		downloads: 'https://img.shields.io/npm/dm/@mdocui/core?color=green',
		available: true,
	},
	{
		name: '@mdocui/react',
		description: '24 components, Renderer, useRenderer hook',
		badge: 'https://img.shields.io/npm/v/@mdocui/react?color=blue',
		downloads: 'https://img.shields.io/npm/dm/@mdocui/react?color=green',
		available: true,
	},
	{
		name: '@mdocui/cli',
		description: 'Scaffold, generate, preview',
		badge: 'https://img.shields.io/npm/v/@mdocui/cli?color=blue',
		downloads: 'https://img.shields.io/npm/dm/@mdocui/cli?color=green',
		available: true,
	},
	{
		name: '@mdocui/vue',
		description: 'Vue renderer',
		badge: null,
		downloads: null,
		available: false,
	},
	{
		name: '@mdocui/svelte',
		description: 'Svelte renderer',
		badge: null,
		downloads: null,
		available: false,
	},
]

const codeLines = [
	{ text: '{% card title="Key Metrics" %}', parts: [
		{ value: '{% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: 'card', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' title=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"Key Metrics"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' %}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% grid cols=3 %}', parts: [
		{ value: '  {% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: 'grid', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' cols=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '3', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' %}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% stat ... /%}', parts: [
		{ value: '  {% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: 'stat', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' label=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"Revenue"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' value=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"$12,482"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' /%}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% stat ... /%}', parts: [
		{ value: '  {% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: 'stat', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' label=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"Orders"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' value=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"284"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' /%}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% stat ... /%}', parts: [
		{ value: '  {% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: 'stat', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' label=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"Avg Order"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' value=', color: 'text-teal-600 dark:text-teal-400' },
		{ value: '"$43.95"', color: 'text-orange-500 dark:text-orange-400' },
		{ value: ' /%}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% /grid %}', parts: [
		{ value: '  {% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: '/grid', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' %}', color: 'text-blue-500 dark:text-blue-400' },
	] },
	{ text: '{% /card %}', parts: [
		{ value: '{% ', color: 'text-blue-500 dark:text-blue-400' },
		{ value: '/card', color: 'text-teal-600 dark:text-teal-400' },
		{ value: ' %}', color: 'text-blue-500 dark:text-blue-400' },
	] },
]

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
			{/* Hero — always dark for logo visibility */}
			<div className="bg-zinc-950 text-zinc-100">
			<section className="relative px-6 pt-20 pb-24 flex flex-col items-center text-center max-w-4xl mx-auto">
				<div className="flex flex-col items-center">
					{/* Gradient glow behind heading */}
					<div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

					<Image
						src="https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png"
						alt="mdocUI logo"
						width={300}
						height={80}
						className="mb-8 relative"
						unoptimized
					/>
					<h1 className="relative text-4xl sm:text-5xl font-bold tracking-tight mb-4">
						Generative UI for LLMs
					</h1>
					<p className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed">
						LLMs write markdown and drop interactive UI components in the same stream — charts, buttons, forms, tables, cards. No custom DSL, no JSON blocks.
					</p>

					<div className="relative inline-block w-full max-w-lg">
						<pre className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-mono text-zinc-300 pr-12 overflow-x-auto">
							{installCmd}
						</pre>
						<CopyButton text={installCmd} />
					</div>

					<div className="flex items-center justify-center gap-4 mt-6 mb-2">
						<a href="https://github.com/mdocui/mdocui" target="_blank" rel="noopener noreferrer">
							<img src="https://img.shields.io/github/stars/mdocui/mdocui?style=social" alt="GitHub stars" className="h-5" />
						</a>
						<a href="https://www.npmjs.com/package/@mdocui/core" target="_blank" rel="noopener noreferrer">
							<img src="https://img.shields.io/npm/v/@mdocui/core?label=npm&color=blue" alt="npm version" className="h-5" />
						</a>
					</div>

					<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
						<Link
							href="/demo/ecommerce"
							className="px-5 sm:px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
						>
							Try Demo
						</Link>
						<a
							href="https://mdocui.github.io"
							target="_blank"
							rel="noopener noreferrer"
							className="px-5 sm:px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
						>
							Documentation
						</a>
						<a
							href="https://github.com/mdocui/mdocui"
							target="_blank"
							rel="noopener noreferrer"
							className="px-5 sm:px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
						>
							GitHub
						</a>
					</div>
				</div>
			</section>
			</div>

			{/* Demo GIF */}
			<section className="px-6 py-20 max-w-4xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-4">See it in action</h2>
				<p className="text-zinc-500 dark:text-zinc-400 text-center mb-10 max-w-xl mx-auto">An LLM streams a full analytics dashboard — stats, charts, tables, and action buttons — all in real-time.</p>
				<div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
					<img
						src="https://raw.githubusercontent.com/mdocui/.github/main/assets/demo.gif"
						alt="mdocUI demo — LLM streaming a dashboard with stats, charts, tables, and action buttons in real-time"
						className="w-full"
						width={1200}
						height={676}
						loading="lazy"
					/>
				</div>
			</section>

			{/* Code Example */}
			<section className="px-6 py-20 max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-12">What the LLM writes</h2>
				<div className="grid md:grid-cols-2 gap-8 items-start">
					<div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
						<div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/50">
							mdocUI Markup
						</div>
						<div className="p-4 font-mono text-xs sm:text-sm leading-6 sm:leading-7 overflow-x-auto">
							{codeLines.map((line, i) => (
								<div key={i} className="flex whitespace-nowrap">
									<span className="select-none w-6 sm:w-8 text-right mr-3 sm:mr-4 text-zinc-400 dark:text-zinc-600 text-xs leading-6 sm:leading-7">{i + 1}</span>
									<span>
										{line.parts.map((part, j) => (
											<span key={j} className={part.color}>{part.value}</span>
										))}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col justify-center">
						<h3 className="text-xl font-semibold mb-3">Markdoc syntax, zero friction</h3>
						<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
							The LLM streams plain text with <code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xs">{`{% tag %}`}</code> delimiters. The streaming parser tokenizes each chunk as it arrives and renders live UI components — stats, charts, tables, forms — inline with prose.
						</p>
						<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
							No JSON schema negotiation. No tool calls. No post-processing. The model just writes, and users see rich interactive UI appear character by character.
						</p>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="px-6 py-20 max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-12">Built for real-time AI interfaces</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
						>
							<h3 className="text-base font-semibold mb-2">{feature.title}</h3>
							<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* Packages */}
			<section className="px-6 py-20 max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-12">Packages</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{packages.map((pkg) => (
						<div
							key={pkg.name}
							className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col"
						>
							<h3 className="text-sm font-semibold font-mono mb-1">{pkg.name}</h3>
							<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex-1">{pkg.description}</p>
							<div className="flex items-center gap-3 flex-wrap">
								{pkg.badge ? (
									<>
										<img src={pkg.badge} alt={`${pkg.name} version`} className="h-5" />
										{pkg.downloads && (
											<img src={pkg.downloads} alt={`${pkg.name} downloads`} className="h-5" />
										)}
									</>
								) : (
									<span className="text-xs text-zinc-500 dark:text-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
										Coming Soon
									</span>
								)}
								{pkg.available && (
									<span className="text-xs text-emerald-600 dark:text-emerald-400">Available</span>
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Playground CTA */}
			<section className="px-6 py-20 text-center">
				<div className="inline-block rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500">
					<Link
						href="/playground"
						className="inline-block px-10 py-4 rounded-[10px] bg-white dark:bg-zinc-950 text-blue-600 dark:text-blue-400 text-base font-semibold hover:bg-blue-50 dark:hover:bg-zinc-900 transition-colors"
					>
						Try the Playground
					</Link>
				</div>
				<p className="text-zinc-500 dark:text-zinc-500 text-sm mt-4">
					Write mdocUI markup and see it render live
				</p>
			</section>

			{/* Roadmap */}
			<section className="px-6 py-20 max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-12">Roadmap</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
						<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available</span>
						<h3 className="text-base font-semibold mt-2 font-mono">@mdocui/core</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Streaming parser, registry, prompt generator</p>
					</div>
					<div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
						<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available</span>
						<h3 className="text-base font-semibold mt-2 font-mono">@mdocui/react</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">24 components, Renderer, useRenderer hook</p>
					</div>
					<div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30">
						<span className="text-xs text-zinc-500 dark:text-zinc-600 font-medium">Coming Soon</span>
						<h3 className="text-base font-semibold mt-2 font-mono">@mdocui/vue</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Vue renderer with the same 24 components</p>
					</div>
					<div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30">
						<span className="text-xs text-zinc-500 dark:text-zinc-600 font-medium">Coming Soon</span>
						<h3 className="text-base font-semibold mt-2 font-mono">@mdocui/svelte</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Svelte renderer</p>
					</div>
				</div>
				<div className="mt-8 grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
					<div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30">
						<span className="text-xs text-zinc-500 dark:text-zinc-600 font-medium">Planned</span>
						<h3 className="text-base font-semibold mt-2">VS Code Extension</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Syntax highlighting and autocomplete for {`{% %}`} tags</p>
					</div>
					<div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30">
						<span className="text-xs text-zinc-500 dark:text-zinc-600 font-medium">Planned</span>
						<h3 className="text-base font-semibold mt-2">v1.0.0</h3>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stable API, frozen component props, CHANGELOG</p>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="px-6 py-20 max-w-3xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
				<div className="space-y-6">
					{[
						{
							q: 'What is mdocUI?',
							a: 'mdocUI is an open-source library that lets LLMs write interactive UI components (charts, tables, forms, buttons) inline with markdown using Markdoc {% %} tag syntax. Everything streams in real-time.',
						},
						{
							q: 'Which LLM providers does it work with?',
							a: 'Any provider that streams text — OpenAI, Anthropic, Google, Mistral, local models, or any custom API. mdocUI parses the output, it doesn\'t care where it comes from.',
						},
						{
							q: 'Do I need to train the model on the syntax?',
							a: 'No. Markdoc {% %} syntax is already in most LLM training data (Stripe docs, Cloudflare docs). Just include the auto-generated system prompt from generatePrompt() and models write it correctly.',
						},
						{
							q: 'Can I use my own components?',
							a: 'Yes. Pass a components prop to the Renderer with your own React components (shadcn, Radix, custom). You can override any of the 24 built-in components or add new ones.',
						},
						{
							q: 'Is it production ready?',
							a: 'mdocUI is in alpha (0.6.x). The core API is stabilizing but may change between minor versions. We follow semver and will freeze the API at v1.0.',
						},
						{
							q: 'How does streaming work?',
							a: 'The parser processes tokens character-by-character using a state machine. As soon as {% is detected, it switches from prose mode to tag mode. No buffering, no regex, no lookahead — components appear the moment the closing tag arrives.',
						},
						{
							q: 'What frameworks are supported?',
							a: '@mdocui/core is framework-agnostic. @mdocui/react is the first renderer. Vue and Svelte renderers are on the roadmap.',
						},
					].map((faq) => (
						<details key={faq.q} className="group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
							<summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
								{faq.q}
								<span className="text-zinc-400 group-open:rotate-45 transition-transform text-lg ml-4">+</span>
							</summary>
							<div className="px-6 pb-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
								{faq.a}
							</div>
						</details>
					))}
				</div>
			</section>

			{/* Footer — always dark */}
			<footer className="bg-zinc-950 text-zinc-100 border-t border-zinc-800 px-6 py-12">
				<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-3">
						<Image
							src="https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png"
							alt="mdocUI"
							width={140}
							height={38}
							unoptimized
						/>
					</div>
					<nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-zinc-500">
						<a href="https://github.com/mdocui/mdocui" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
						<a href="https://www.npmjs.com/org/mdocui" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">npm</a>
						<a href="https://mdocui.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Documentation</a>
						<Link href="/demo/ecommerce" className="hover:text-zinc-300 transition-colors">Live Demo</Link>
						<a href="https://github.com/mdocui/mdocui/blob/main/SKILL.md" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">SKILL.md</a>
					</nav>
				</div>
				<p className="text-center text-xs text-zinc-600 mt-8">
					MIT License &middot; Built by{' '}
					<a href="https://github.com/pnutmath" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
						pnutmath
					</a>
				</p>
			</footer>
		</div>
	)
}
