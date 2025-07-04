import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hypeflo.ws'

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/workflow/*',
                    '/authors/*',
                    '/browse',
                    '/submit',
                    '/about',
                    '/api/og',
                ],
                disallow: [
                    '/admin/*',
                    '/api/*',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
