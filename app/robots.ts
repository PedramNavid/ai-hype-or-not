import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aihypeornot.com'
  
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