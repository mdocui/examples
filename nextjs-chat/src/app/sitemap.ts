import type { MetadataRoute } from 'next'

const baseUrl = 'https://mdocui.vercel.app'

// Kept next to the routes rather than as a static file in public/, so adding a
// page here is one edit instead of two, and lastmod tracks the build.
const routes: { path: string; priority: number }[] = [
	{ path: '/', priority: 1.0 },
	{ path: '/demo/ecommerce', priority: 0.8 },
	{ path: '/demo/ecommerce-react', priority: 0.8 },
	{ path: '/demo/ecommerce-web-component', priority: 0.8 },
	{ path: '/playground', priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()
	return routes.map(({ path, priority }) => ({
		url: `${baseUrl}${path}`,
		lastModified,
		changeFrequency: 'weekly',
		priority,
	}))
}
