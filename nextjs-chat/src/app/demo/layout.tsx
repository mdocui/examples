import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'E-commerce Demo — mdocUI',
	description: 'ShopMetrics: AI-powered e-commerce analytics demo built with mdocUI generative UI components.',
	alternates: { canonical: '/demo/ecommerce' },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
