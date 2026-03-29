import type { NextConfig } from 'next'

const config: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/mdocui/**',
			},
		],
	},
}

export default config
