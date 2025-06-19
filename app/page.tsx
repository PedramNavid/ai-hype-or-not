import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"

interface Product {
  id: string
  name: string
  slug: string
  category: string
  rating: "LEGIT" | "OVERHYPED"
  hyeScore: number
  description: string
  image: string
  tags: string[]
}

async function getProducts(): Promise<Product[]> {
  // For server-side rendering, use the internal API directly
  if (typeof window === 'undefined') {
    // We're on the server, import and call the API function directly
    const { sql } = await import('@/lib/db')
    
    try {
      const products = await sql`
        SELECT 
          id,
          name,
          slug,
          verdict as rating,
          hype_score as "hyeScore",
          tagline as description,
          COALESCE(
            (SELECT image_url FROM product_screenshots WHERE product_id = products.id ORDER BY display_order LIMIT 1),
            '/placeholder-product.jpg'
          ) as image,
          ARRAY['AI Tools'] as tags
        FROM products 
        ORDER BY created_at DESC
      `
      
      return products as Product[]
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }
  
  // Client-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

export default async function HomePage() {
  const products = await getProducts()
  const legitProducts = products.filter((p) => p.rating === "LEGIT")
  const overhypedProducts = products.filter((p) => p.rating === "OVERHYPED")

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 tracking-tight">AI HYPE OR NOT</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Cutting through the AI noise with honest reviews and ratings. Every tool personally tested and rated on the
            hype scale.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 border border-gray-200 rounded-2xl">
            <div className="text-4xl font-bold text-green-600 mb-2">{legitProducts.length}</div>
            <div className="text-gray-600 font-medium">LEGIT Tools</div>
          </div>
          <div className="text-center p-8 border border-gray-200 rounded-2xl">
            <div className="text-4xl font-bold text-red-500 mb-2">{overhypedProducts.length}</div>
            <div className="text-gray-600 font-medium">OVERHYPED Tools</div>
          </div>
          <div className="text-center p-8 border border-gray-200 rounded-2xl">
            <div className="text-4xl font-bold text-orange-500 mb-2">{products.length}</div>
            <div className="text-gray-600 font-medium">Total Reviews</div>
          </div>
        </div>

        {/* HYPE Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm">LEGIT</div>
            <h2 className="text-3xl font-bold text-gray-900">Actually Legit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legitProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* NOT HYPE Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">OVERHYPED</div>
            <h2 className="text-3xl font-bold text-gray-900">Overhyped</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {overhypedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
