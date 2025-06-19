import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">About AI Hype Or Not</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Cutting through the AI noise with honest, hands-on reviews
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The AI space is moving incredibly fast, with new tools launching every week promising to revolutionize how
              we work. But not all AI tools are created equal, and the hype doesn&apos;t always match the reality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              AI Hype Or Not exists to cut through the marketing noise and provide honest, practical reviews of AI
              tools. Every tool is personally tested in real-world scenarios, not just demos or marketing materials.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our goal is simple: help you decide which AI tools are worth your time and money, and which ones are just
              hype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-600 mb-4">LEGIT Criteria</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Genuinely improves productivity</li>
                <li>• Works reliably in real scenarios</li>
                <li>• Good value for money</li>
                <li>• Intuitive and well-designed</li>
                <li>• Active development and support</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-500 mb-4">OVERHYPED Criteria</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Overpromises, underdelivers</li>
                <li>• Unreliable or buggy</li>
                <li>• Poor value proposition</li>
                <li>• Confusing or poorly designed</li>
                <li>• Lacks meaningful differentiation</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Hands-On Testing</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Extensive real-world usage across multiple projects and scenarios
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Objective Analysis</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Evaluation based on functionality, reliability, and value
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Honest Verdict</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Clear recommendation: LEGIT or OVERHYPED, with detailed reasoning
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
