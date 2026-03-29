import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './theme-provider'
import { Nav } from './nav'

const baseUrl = 'https://mdocui.vercel.app'

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
	},
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
