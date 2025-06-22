import { MetadataRoute } from 'next'
import { sql } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aihypeornot.com'
  
  // Get all published workflows
  const workflows = await sql`
    SELECT slug, updated_at 
    FROM workflows 
    WHERE status = 'published'
    ORDER BY updated_at DESC
  `
  
  // Get all authors with workflows
  const authors = await sql`
    SELECT DISTINCT u.slug, u.updated_at
    FROM users u
    JOIN workflows w ON u.id = w.author_id
    WHERE w.status = 'published'
    ORDER BY u.updated_at DESC
  `

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Add workflow pages
  workflows.forEach((workflow) => {
    routes.push({
      url: `${baseUrl}/workflow/${workflow.slug}`,
      lastModified: new Date(workflow.updated_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  // Add author pages
  authors.forEach((author) => {
    routes.push({
      url: `${baseUrl}/authors/${author.slug}`,
      lastModified: new Date(author.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  return routes
}