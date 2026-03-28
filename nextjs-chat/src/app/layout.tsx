import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './theme-provider'

export const metadata: Metadata = {
	title: 'mdocUI ShopMetrics',
	description: 'E-commerce Analytics Demo powered by mdocUI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<body className="m-0 h-screen overflow-hidden font-sans antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
