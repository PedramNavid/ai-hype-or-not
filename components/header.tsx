import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            LLM Workflows
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Browse
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              About
            </Link>
            <Link
              href="/submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Share Workflow
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
