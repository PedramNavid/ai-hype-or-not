import { Header } from "@/components/header"
import { Star, ExternalLink, Calendar, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const products = {
  cursor: {
    name: "Cursor",
    category: "Code Editor",
    rating: "LEGIT" as const,
    hyeScore: 5,
    description: "AI-powered code editor that predicts your next edit",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Coding", "AI Assistant", "Editor"],
    website: "https://cursor.sh",
    reviewDate: "2024-01-15",
    fullReview: `Cursor has completely transformed my coding workflow. This isn't just another code editor with AI bolted on - it's been built from the ground up with AI assistance in mind.

The predictive editing is genuinely magical. It doesn't just complete your current line; it understands the context of your entire project and suggests entire functions, fixes bugs before you even notice them, and helps refactor code with surgical precision.

What sets Cursor apart from other AI coding tools is its seamless integration. The AI suggestions feel natural and don't interrupt your flow. The chat interface is incredibly powerful for explaining complex code or getting help with debugging.

Performance is excellent, and it handles large codebases without breaking a sweat. The team behind Cursor clearly understands developers' needs and has created something that actually makes you more productive rather than just being a novelty.

This is the future of coding, and it's available today.`,
    pros: [
      "Incredibly accurate code predictions",
      "Seamless AI integration that doesn't interrupt flow",
      "Excellent performance with large codebases",
      "Intuitive chat interface for code explanations",
      "Regular updates with meaningful improvements",
    ],
    cons: [
      "Subscription pricing might be steep for some",
      "Learning curve to fully utilize AI features",
      "Limited customization compared to traditional editors",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
  windsurf: {
    name: "Windsurf",
    category: "Code Editor",
    rating: "LEGIT" as const,
    hyeScore: 4,
    description: "AI-first IDE for building software faster",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["IDE", "AI Assistant", "Development"],
    website: "https://windsurf.com",
    reviewDate: "2024-01-10",
    fullReview: `Windsurf positions itself as an AI-first IDE, and it largely delivers on that promise. The interface is clean and modern, clearly designed with AI workflows in mind.

The AI assistant is quite capable and integrates well with the development environment. Code suggestions are generally accurate, and the ability to have contextual conversations about your codebase is valuable.

Where Windsurf shines is in its project understanding. It seems to grasp the architecture and patterns of your application better than many competitors, leading to more relevant suggestions and better debugging assistance.

However, it's still finding its footing in some areas. The ecosystem isn't as mature as established editors, and some advanced features feel like they need more polish.

That said, the trajectory is promising, and for teams looking to embrace AI-first development, Windsurf is definitely worth considering.`,
    pros: [
      "Excellent project-wide context understanding",
      "Clean, modern interface designed for AI workflows",
      "Strong debugging assistance",
      "Good integration with popular frameworks",
    ],
    cons: [
      "Smaller ecosystem compared to established IDEs",
      "Some features still need polish",
      "Limited plugin/extension support",
      "Occasional performance hiccups with very large projects",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
  graphite: {
    name: "Graphite",
    category: "Developer Tools",
    rating: "OVERHYPED" as const,
    hyeScore: 2,
    description: "Modern code review and CI/CD platform",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Code Review", "CI/CD", "Collaboration"],
    website: "https://graphite.dev",
    reviewDate: "2024-01-08",
    fullReview: `Graphite promises to modernize the code review process, but after extensive testing, I'm not convinced it delivers enough value to justify switching from established tools.

The stacked diffs concept is interesting in theory, but in practice, it adds complexity without clear benefits for most development workflows. The learning curve is steep, and team adoption has been challenging.

The UI is polished and the performance is decent, but the core value proposition feels weak. GitHub's native code review tools, while not perfect, are more intuitive and have better ecosystem integration.

Graphite's CI/CD features are basic compared to dedicated platforms like GitHub Actions or CircleCI. It feels like they're trying to do too many things without excelling at any particular one.

For teams already happy with their current code review process, Graphite doesn't offer compelling reasons to switch. The "modern" approach often feels like change for change's sake rather than meaningful improvement.`,
    pros: ["Clean, modern interface", "Decent performance", "Stacked diffs for complex changes", "Good documentation"],
    cons: [
      "Steep learning curve with questionable benefits",
      "Limited ecosystem integration",
      "Basic CI/CD features compared to dedicated tools",
      "Difficult team adoption",
      "Expensive for what it offers",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
  lovable: {
    name: "Lovable",
    category: "No-Code",
    rating: "LEGIT" as const,
    hyeScore: 4,
    description: "AI-powered app builder for rapid prototyping",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["No-Code", "App Builder", "Prototyping"],
    website: "https://lovable.dev",
    reviewDate: "2024-01-12",
    fullReview: `Lovable has impressed me as a genuinely useful AI-powered app builder. Unlike many no-code tools that feel limiting, Lovable strikes a good balance between simplicity and capability.

The AI assistance is where this tool really shines. You can describe what you want in natural language, and it generates surprisingly good starting points. The generated code is clean and follows modern best practices.

What I appreciate most is that you're not locked into a proprietary platform. The apps it generates use standard web technologies, so you can export and continue development elsewhere if needed.

The visual editor is intuitive, and the real-time preview makes iteration fast. For rapid prototyping and MVP development, this is genuinely useful.

The main limitation is complexity - it's great for standard web apps but struggles with highly custom or complex applications. But for its target use case, it delivers real value.`,
    pros: [
      "Excellent AI assistance for app generation",
      "Clean, exportable code output",
      "Intuitive visual editor",
      "Great for rapid prototyping",
      "No vendor lock-in",
    ],
    cons: [
      "Limited for complex applications",
      "AI suggestions can be hit-or-miss for edge cases",
      "Smaller template library",
      "Pricing can add up for multiple projects",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
  "github-copilot": {
    name: "GitHub Copilot",
    category: "AI Assistant",
    rating: "LEGIT" as const,
    hyeScore: 4,
    description: "AI pair programmer that suggests code completions",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["AI Assistant", "Code Completion", "GitHub"],
    website: "https://github.com/features/copilot",
    reviewDate: "2024-01-05",
    fullReview: `GitHub Copilot was one of the first mainstream AI coding assistants, and it remains one of the best. After using it for over a year, it's become an indispensable part of my development workflow.

The code suggestions are remarkably accurate, especially for common patterns and boilerplate code. It's particularly strong with popular languages and frameworks, where its training data is most comprehensive.

What makes Copilot special is its context awareness. It understands not just the current line you're writing, but the broader context of your file and project. This leads to suggestions that are actually useful rather than just syntactically correct.

The integration with VS Code and other editors is seamless. Suggestions appear inline and don't interrupt your flow. The chat feature in newer versions adds another dimension of usefulness for explaining code and debugging.

While not perfect - it sometimes suggests outdated patterns or makes assumptions about your intent - it's genuinely productivity-enhancing for most developers.`,
    pros: [
      "Excellent code completion accuracy",
      "Strong context awareness",
      "Seamless editor integration",
      "Helpful chat feature for explanations",
      "Regular improvements and updates",
    ],
    cons: [
      "Can suggest outdated or suboptimal patterns",
      "Less effective with newer or niche technologies",
      "Subscription cost",
      "Sometimes overconfident in suggestions",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
  "replit-agent": {
    name: "Replit Agent",
    category: "AI Assistant",
    rating: "LEGIT" as const,
    hyeScore: 3,
    description: "AI agent that builds software from natural language",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["AI Agent", "Natural Language", "Development"],
    website: "https://replit.com/agent",
    reviewDate: "2024-01-03",
    fullReview: `Replit Agent represents an interesting evolution in AI-assisted development. The ability to describe what you want in natural language and have it build a working application is genuinely impressive.

For simple to medium complexity projects, it works surprisingly well. I've seen it create functional web apps, games, and utilities from just a few sentences of description. The integration with Replit's environment means everything runs immediately.

The agent is particularly good at understanding common app patterns and implementing them quickly. It handles database setup, API integration, and UI creation with minimal guidance.

However, it struggles with more complex requirements or when you need fine-grained control over the implementation. The generated code, while functional, isn't always optimal and can be difficult to modify for specific needs.

It's best viewed as a rapid prototyping tool rather than a replacement for traditional development. For getting ideas off the ground quickly, it's quite valuable.`,
    pros: [
      "Impressive natural language understanding",
      "Great for rapid prototyping",
      "Handles full-stack development",
      "Immediate execution in Replit environment",
      "Good for learning and experimentation",
    ],
    cons: [
      "Limited control over implementation details",
      "Generated code can be suboptimal",
      "Struggles with complex requirements",
      "Tied to Replit ecosystem",
      "Can be unpredictable with edge cases",
    ],
    screenshots: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
  },
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products[params.slug as keyof typeof products]

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
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 right-6">
              <div
                className={`px-4 py-2 rounded-full font-semibold ${
                  product.rating === "LEGIT" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                {product.rating}
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
                      className={`w-6 h-6 ${i < product.hyeScore ? "text-orange-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xl font-bold text-gray-900 ml-2">{product.hyeScore}/5</span>
                </div>

                <a
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors font-semibold"
                >
                  Visit Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Reviewed {new Date(product.reviewDate).toLocaleDateString()}
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
                {product.fullReview.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`${product.name} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pros */}
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

            {/* Cons */}
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
                  <span className="text-gray-900 font-semibold">{product.hyeScore}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Verdict</span>
                  <span className={`font-semibold ${product.rating === "LEGIT" ? "text-green-600" : "text-red-500"}`}>
                    {product.rating}
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
