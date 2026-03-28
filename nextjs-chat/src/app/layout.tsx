import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from './theme-provider'

export const metadata: Metadata = {
	title: 'mdocUI Chat Example',
	description: 'LLM chat with generative UI components',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="m-0 h-screen overflow-hidden font-sans antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
				<Script id="theme-init" strategy="beforeInteractive">{`
					try {
						var t = localStorage.getItem('mdocui-theme');
						if (t === 'dark' || (!t && true)) {
							document.documentElement.classList.add('dark');
						}
					} catch(e) {}
				`}</Script>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
