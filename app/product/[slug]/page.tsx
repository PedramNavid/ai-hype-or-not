import { Header } from "@/components/header"
import { Star, ExternalLink, Calendar, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${slug}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors font-medium"
        >
          ← Back to Directory
        </Link>

        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-12">
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={product.screenshots?.[0]?.image_url || "/screenshots/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6">
              <div
                className={`px-4 py-2 rounded-full font-semibold ${
                  product.verdict === "LEGIT" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                {product.verdict}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="text-orange-500 text-lg font-medium">{product.category}</div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < product.hype_score ? "text-orange-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xl font-bold text-gray-900 ml-2">{product.hype_score}/5</span>
                </div>

                {product.website_url && (
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors font-semibold"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.tagline}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                AI Tool
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Reviewed {new Date(product.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Review
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Review */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Review</h2>
              <div className="prose prose-gray max-w-none">
                {product.full_review.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            {product.screenshots && product.screenshots.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={screenshot.image_url || "/screenshots/placeholder.svg"}
                        alt={screenshot.caption || `${product.name} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pros */}
            {product.pros && product.pros.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-600 mb-4">Pros</h3>
                <ul className="space-y-3">
                  {product.pros.map((pro, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start gap-3">
                      <span className="text-green-600 mt-1 font-bold">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {product.cons && product.cons.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-500 mb-4">Cons</h3>
                <ul className="space-y-3">
                  {product.cons.map((con, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start gap-3">
                      <span className="text-red-500 mt-1 font-bold">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="text-gray-900 font-semibold">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Hype Score</span>
                  <span className="text-gray-900 font-semibold">{product.hype_score}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Verdict</span>
                  <span className={`font-semibold ${product.verdict === "LEGIT" ? "text-green-600" : "text-red-500"}`}>
                    {product.verdict}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
