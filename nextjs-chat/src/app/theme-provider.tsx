'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; mounted: boolean }>({
	theme: 'dark',
	toggle: () => {},
	mounted: false,
})

export function useTheme() {
	return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('dark')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem('mdocui-theme') as Theme | null
		const initial = saved ?? 'dark'
		setTheme(initial)
		document.documentElement.classList.toggle('dark', initial === 'dark')
		setMounted(true)
	}, [])

	const toggle = () => {
		setTheme((prev) => {
			const next = prev === 'dark' ? 'light' : 'dark'
			document.documentElement.classList.toggle('dark', next === 'dark')
			localStorage.setItem('mdocui-theme', next)
			return next
		})
	}

	return <ThemeContext.Provider value={{ theme, toggle, mounted }}>{children}</ThemeContext.Provider>
}
