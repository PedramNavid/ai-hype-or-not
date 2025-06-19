"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = [
  "Code Editor",
  "AI Assistant",
  "Developer Tools",
  "No-Code",
  "Design Tools",
  "Productivity",
  "Writing",
  "Data Analysis",
  "Other",
]

export function SubmitForm() {
  const [formData, setFormData] = useState({
    toolName: "",
    website: "",
    category: "",
    description: "",
    whyReview: "",
    yourName: "",
    yourEmail: "",
    additionalNotes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Submission Received!</h3>
        <p className="text-gray-600 mb-6">
          Thanks for the suggestion! I&apos;ll review <strong>{formData.toolName}</strong> and get back to you within 2-3
          weeks with my verdict.
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              toolName: "",
              website: "",
              category: "",
              description: "",
              whyReview: "",
              yourName: "",
              yourEmail: "",
              additionalNotes: "",
            })
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Submit Another Tool
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="toolName" className="block text-sm font-semibold text-gray-900 mb-2">
            Tool Name *
          </label>
          <input
            type="text"
            id="toolName"
            name="toolName"
            required
            value={formData.toolName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., Cursor, Claude, etc."
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
            Website URL *
          </label>
          <input
            type="url"
            id="website"
            name="website"
            required
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
          Brief Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="What does this tool do? Keep it brief..."
        />
      </div>

      <div>
        <label htmlFor="whyReview" className="block text-sm font-semibold text-gray-900 mb-2">
          Why should I review this? *
        </label>
        <textarea
          id="whyReview"
          name="whyReview"
          required
          rows={3}
          value={formData.whyReview}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="What makes this tool interesting or unique? Is it getting a lot of buzz?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="yourName" className="block text-sm font-semibold text-gray-900 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="yourName"
            name="yourName"
            required
            value={formData.yourName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="First name is fine"
          />
        </div>

        <div>
          <label htmlFor="yourEmail" className="block text-sm font-semibold text-gray-900 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            id="yourEmail"
            name="yourEmail"
            required
            value={formData.yourEmail}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-semibold text-gray-900 mb-2">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={3}
          value={formData.additionalNotes}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Anything else I should know? (Optional)"
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Tool for Review"}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        I&apos;ll personally review every submission and get back to you within 2-3 weeks with my verdict.
      </p>
    </form>
  )
}
