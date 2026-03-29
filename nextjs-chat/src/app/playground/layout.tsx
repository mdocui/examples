import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Playground — mdocUI',
	description: 'Write mdocUI markup and see it render live. Interactive playground for Markdoc generative UI components.',
	alternates: { canonical: '/playground' },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
	return children
}
