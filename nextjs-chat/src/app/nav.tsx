'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from './theme-provider'

export function Nav() {
	const { theme, toggle, mounted } = useTheme()
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
			<Link href="/" className="text-lg font-semibold tracking-tight">
				mdoc<span className="text-zinc-400 dark:text-zinc-500">UI</span>
			</Link>

			{/* Desktop nav */}
			<div className="hidden sm:flex items-center gap-5">
				<NavLinks />
				<ThemeToggle theme={theme} toggle={toggle} mounted={mounted} />
			</div>

			{/* Mobile: theme toggle + hamburger */}
			<div className="flex sm:hidden items-center gap-2">
				<ThemeToggle theme={theme} toggle={toggle} mounted={mounted} />
				<button
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
					className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-600 dark:text-zinc-400"
					aria-label="Toggle menu"
				>
					{menuOpen ? (
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					) : (
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
					)}
				</button>
			</div>

			{/* Mobile dropdown */}
			{menuOpen && (
				<div className="absolute top-14 left-0 right-0 sm:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col gap-4 shadow-lg">
					<Link
						href="/playground"
						onClick={() => setMenuOpen(false)}
						className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
					>
						Playground
					</Link>
					<Link
						href="/demo/ecommerce"
						onClick={() => setMenuOpen(false)}
						className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
					>
						Demo
					</Link>
					<a
						href="https://mdocui.github.io"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
					>
						Docs
					</a>
					<a
						href="https://github.com/mdocui/mdocui"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
					>
						GitHub
					</a>
				</div>
			)}
		</nav>
	)
}

function NavLinks() {
	return (
		<>
			<Link
				href="/playground"
				className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
			>
				Playground
			</Link>
			<Link
				href="/demo/ecommerce"
				className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
			>
				Demo
			</Link>
			<a
				href="https://mdocui.github.io"
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
			>
				Docs
			</a>
			<a
				href="https://github.com/mdocui/mdocui"
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
			>
				GitHub
			</a>
		</>
	)
}

function ThemeToggle({ theme, toggle, mounted }: { theme: string; toggle: () => void; mounted: boolean }) {
	return (
		<button
			type="button"
			onClick={toggle}
			className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-600 dark:text-zinc-400 w-8 h-8 flex items-center justify-center"
			aria-label="Toggle theme"
		>
			{mounted ? (
				theme === 'dark' ? (
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				) : (
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				)
			) : null}
		</button>
	)
}
