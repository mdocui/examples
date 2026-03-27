import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'mdocUI Chat Example',
	description: 'LLM chat with generative UI components',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					padding: 0,
					fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
					background: '#0a0a0a',
					color: '#fafafa',
					height: '100vh',
					overflow: 'hidden',
				}}
			>
				{children}
			</body>
		</html>
	)
}
