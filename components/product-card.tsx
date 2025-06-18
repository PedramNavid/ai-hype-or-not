import Link from "next/link"
import { Star } from "lucide-react"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.rating === "LEGIT" ? "bg-green-600 text-white" : "bg-red-500 text-white"
              }`}
            >
              {product.rating}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < product.hyeScore ? "text-orange-400 fill-current" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">{product.hyeScore}/5</span>
            </div>
          </div>

          <div className="text-sm text-orange-500 font-medium mb-3">{product.category}</div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
