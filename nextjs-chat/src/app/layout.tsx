import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './theme-provider'
import { Nav } from './nav'

const baseUrl = 'https://mdocui.vercel.app'
const ogImage = 'https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png'

export const metadata: Metadata = {
	title: 'mdocUI — Generative UI for LLMs',
	description: 'LLMs write markdown and drop interactive UI components in the same stream — charts, buttons, forms, tables, cards.',
	metadataBase: new URL(baseUrl),
	alternates: { canonical: '/' },
	icons: { icon: '/favicon.ico', apple: '/favicon.png' },
	openGraph: {
		title: 'mdocUI — Generative UI for LLMs',
		description: 'LLMs write markdown and drop interactive UI components in the same stream using Markdoc syntax.',
		url: baseUrl,
		siteName: 'mdocUI',
		type: 'website',
		images: [{ url: ogImage, width: 1200, height: 670, alt: 'mdocUI — Generative UI for LLMs' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'mdocUI — Generative UI for LLMs',
		description: 'LLMs write markdown and drop interactive UI components in the same stream using Markdoc syntax.',
		images: [ogImage],
	},
	keywords: ['mdocUI', 'generative UI', 'LLM', 'Markdoc', 'React', 'streaming', 'AI components', 'TypeScript'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('mdocui-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'SoftwareSourceCode',
							name: 'mdocUI',
							description: 'Generative UI library for LLMs using Markdoc tag syntax inline with markdown prose.',
							url: 'https://mdocui.vercel.app',
							codeRepository: 'https://github.com/mdocui/mdocui',
							programmingLanguage: 'TypeScript',
							license: 'https://opensource.org/licenses/MIT',
							author: { '@type': 'Organization', name: 'mdocUI', url: 'https://github.com/mdocui' },
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'FAQPage',
							mainEntity: [
								{ '@type': 'Question', name: 'What is mdocUI?', acceptedAnswer: { '@type': 'Answer', text: 'mdocUI is an open-source library that lets LLMs write interactive UI components (charts, tables, forms, buttons) inline with markdown using Markdoc {% %} tag syntax. Everything streams in real-time.' } },
								{ '@type': 'Question', name: 'Which LLM providers does it work with?', acceptedAnswer: { '@type': 'Answer', text: 'Any provider that streams text — OpenAI, Anthropic, Google, Mistral, local models, or any custom API. mdocUI parses the output, it doesn\'t care where it comes from.' } },
								{ '@type': 'Question', name: 'Do I need to train the model on the syntax?', acceptedAnswer: { '@type': 'Answer', text: 'No. Markdoc {% %} syntax is already in most LLM training data (Stripe docs, Cloudflare docs). Just include the auto-generated system prompt from generatePrompt() and models write it correctly.' } },
								{ '@type': 'Question', name: 'Can I use my own components?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Pass a components prop to the Renderer with your own React components (shadcn, Radix, custom). You can override any of the 24 built-in components or add new ones.' } },
								{ '@type': 'Question', name: 'Is it production ready?', acceptedAnswer: { '@type': 'Answer', text: 'mdocUI is in alpha (0.6.x). The core API is stabilizing but may change between minor versions. We follow semver and will freeze the API at v1.0.' } },
								{ '@type': 'Question', name: 'How does streaming work?', acceptedAnswer: { '@type': 'Answer', text: 'The parser processes tokens character-by-character using a state machine. As soon as {% is detected, it switches from prose mode to tag mode. No buffering, no regex, no lookahead — components appear the moment the closing tag arrives.' } },
								{ '@type': 'Question', name: 'What frameworks are supported?', acceptedAnswer: { '@type': 'Answer', text: '@mdocui/core is framework-agnostic. @mdocui/react is the first renderer. Vue and Svelte renderers are on the roadmap.' } },
							],
						}),
					}}
				/>
			</head>
			<body className="m-0 min-h-screen font-sans antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
				<ThemeProvider>
					<Nav />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
