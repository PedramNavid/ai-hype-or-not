import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"

const products = [
  {
    id: "cursor",
    name: "Cursor",
    slug: "cursor",
    category: "Code Editor",
    rating: "LEGIT",
    hyeScore: 5,
    description: "AI-powered code editor that predicts your next edit",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Coding", "AI Assistant", "Editor"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    slug: "windsurf",
    category: "Code Editor",
    rating: "LEGIT",
    hyeScore: 4,
    description: "AI-first IDE for building software faster",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["IDE", "AI Assistant", "Development"],
  },
  {
    id: "graphite",
    name: "Graphite",
    slug: "graphite",
    category: "Developer Tools",
    rating: "OVERHYPED",
    hyeScore: 2,
    description: "Modern code review and CI/CD platform",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Code Review", "CI/CD", "Collaboration"],
  },
  {
    id: "lovable",
    name: "Lovable",
    slug: "lovable",
    category: "No-Code",
    rating: "LEGIT",
    hyeScore: 4,
    description: "AI-powered app builder for rapid prototyping",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["No-Code", "App Builder", "Prototyping"],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    slug: "github-copilot",
    category: "AI Assistant",
    rating: "LEGIT",
    hyeScore: 4,
    description: "AI pair programmer that suggests code completions",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["AI Assistant", "Code Completion", "GitHub"],
  },
  {
    id: "replit-agent",
    name: "Replit Agent",
    slug: "replit-agent",
    category: "AI Assistant",
    rating: "LEGIT",
    hyeScore: 3,
    description: "AI agent that builds software from natural language",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["AI Agent", "Natural Language", "Development"],
  },
]

export default function HomePage() {
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
