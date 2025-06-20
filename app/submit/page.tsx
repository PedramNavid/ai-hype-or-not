import { Header } from "@/components/header"
import { WorkflowSubmitForm } from "@/components/workflow-submit-form"
import { Lightbulb, Code, Users, CheckCircle } from "lucide-react"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Share Your Workflow</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have a LLM coding workflow that actually works? Share it with the community and help other developers ship faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Battle-Tested Only</h3>
              </div>
              <p className="text-blue-800 text-sm">
                Share workflows you've actually used in real projects, not theoretical approaches.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Include Specifics</h3>
              </div>
              <p className="text-green-800 text-sm">
                Provide actual prompts, commands, and configurations that others can use.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Help the Community</h3>
              </div>
              <p className="text-purple-800 text-sm">
                Explain when to use your workflow and what problems it solves.
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Quality Focus</h3>
              </div>
              <p className="text-orange-800 text-sm">
                We review all submissions to ensure high quality and practical value.
              </p>
            </div>
          </div>

          <WorkflowSubmitForm />
        </div>
      </main>
    </div>
  )
}
