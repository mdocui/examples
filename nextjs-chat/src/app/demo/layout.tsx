import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'E-commerce Demo — mdocUI',
	description: 'ShopMetrics: AI-powered e-commerce analytics demo built with mdocUI. Interactive dashboards with charts, tables, and stats streamed in real-time.',
	alternates: { canonical: '/demo/ecommerce' },
	openGraph: {
		title: 'ShopMetrics — E-commerce Demo | mdocUI',
		description: 'AI-powered e-commerce analytics demo with streaming charts, tables, and interactive dashboards built with mdocUI.',
		url: 'https://mdocui.vercel.app/demo/ecommerce',
		images: [{ url: 'https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png', width: 1200, height: 670, alt: 'mdocUI E-commerce Demo' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ShopMetrics — E-commerce Demo | mdocUI',
		description: 'AI-powered e-commerce analytics demo with streaming charts, tables, and interactive dashboards.',
		images: ['https://raw.githubusercontent.com/mdocui/.github/main/assets/logo.png'],
	},
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
