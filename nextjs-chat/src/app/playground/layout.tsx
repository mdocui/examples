import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Playground — mdocUI',
	description: 'Write mdocUI markup and see it render live. Interactive playground for Markdoc generative UI components — charts, tables, forms, cards, and more.',
	alternates: { canonical: '/playground' },
	openGraph: {
		title: 'Playground — mdocUI',
		description: 'Interactive playground for Markdoc generative UI components. Write markup, see it render live.',
		url: 'https://mdocui.vercel.app/playground',
		images: [{ url: 'https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png', width: 1200, height: 670, alt: 'mdocUI Playground' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Playground — mdocUI',
		description: 'Interactive playground for Markdoc generative UI components. Write markup, see it render live.',
		images: ['https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png'],
	},
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
	return children
}
