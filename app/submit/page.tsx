import { Header } from "@/components/header"
import { SubmitForm } from "@/components/submit-form"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Submit a Tool</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Know an AI tool that deserves a review? Submit it here and I'll personally test it and share my honest
              verdict.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submission Guidelines</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <p>
                  Tools must be AI-powered or AI-adjacent (coding assistants, design tools, productivity apps, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <p>Must be publicly available (not in private beta)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <p>I'll test each tool for at least 1-2 weeks before reviewing</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <p>Reviews are completely honest - no paid promotions or sponsored content</p>
              </div>
            </div>
          </div>

          <SubmitForm />
        </div>
      </main>
    </div>
  )
}
