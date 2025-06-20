import { Header } from "@/components/header"
import { ArrowRight, Users, BookOpen, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About LLM Workflows</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A community-driven platform for sharing battle-tested LLM development workflows that actually work.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              LLMs are transforming how we write code, but most developers are still figuring out how to use them effectively. 
              Generic tutorials don't capture the nuance of real development workflows.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're building a community where practitioners share their actual workflows - the processes they've refined 
              through trial and error, complete with prompts, tools, and hard-won insights.
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">What Makes a Good Workflow</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <div className="text-lg font-bold text-blue-900 mb-3">Battle-Tested</div>
                <p className="text-blue-800 text-sm">
                  Used in real projects, not theoretical. Includes actual prompts, commands, and configurations.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                <div className="text-lg font-bold text-green-900 mb-3">Structured</div>
                <p className="text-green-800 text-sm">
                  Clear step-by-step process that others can follow and adapt to their needs.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                <div className="text-lg font-bold text-purple-900 mb-3">Context-Rich</div>
                <p className="text-purple-800 text-sm">
                  Explains when to use the workflow, what problems it solves, and potential pitfalls.
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                <div className="text-lg font-bold text-orange-900 mb-3">Tool-Specific</div>
                <p className="text-orange-800 text-sm">
                  Covers specific tools and their configurations, not just general principles.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Workflow Categories</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-green-400 pl-6 py-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Greenfield Development</h3>
                <p className="text-gray-700 text-sm">
                  Building new projects from scratch using LLMs for ideation, planning, and implementation.
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-6 py-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refactoring</h3>
                <p className="text-gray-700 text-sm">
                  Modernizing legacy code with AI assistance for analysis, planning, and execution.
                </p>
              </div>
              <div className="border-l-4 border-red-400 pl-6 py-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Debugging</h3>
                <p className="text-gray-700 text-sm">
                  Systematic approaches to finding and fixing bugs using LLM assistance.
                </p>
              </div>
              <div className="border-l-4 border-purple-400 pl-6 py-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing</h3>
                <p className="text-gray-700 text-sm">
                  Creating comprehensive test suites and evaluation systems with AI help.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Community Guidelines</h2>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Share workflows you've actually used in real projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Include specific prompts, commands, and configurations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Explain context: when to use, what problems it solves</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Be honest about limitations and failure modes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Don't share theoretical or untested approaches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Avoid overly promotional content about specific tools</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Inspired By</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This platform is inspired by practitioners who are openly sharing their LLM workflows:
            </p>
            <div className="space-y-3 text-gray-700">
              <div>
                <strong>Harper Reed</strong> - Sharing greenfield development workflows and calling for "multiplayer" approaches
              </div>
              <div>
                <strong>Geoffrey Huntley</strong> - Building stdlib approaches for Cursor rules and AI workflows
              </div>
              <div>
                <strong>Hamel Husain</strong> - Pioneering evaluation-first development and domain-specific LLM judging
              </div>
              <div>
                <strong>Simon Willison</strong> - Documenting practical LLM usage patterns and tools
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the Community</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Have a workflow that's working for you? Share it with the community and help other developers 
              level up their LLM-assisted development process.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
              >
                Share Your Workflow
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/browse"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Browse Workflows
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
