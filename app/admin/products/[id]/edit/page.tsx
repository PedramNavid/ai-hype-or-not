"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/image-upload"

const categories = [
  "Code Editor",
  "AI Assistant", 
  "Developer Tools",
  "No-Code",
  "Design Tools",
  "Productivity",
  "Writing",
  "Data Analysis",
  "Other"
]

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditProduct({ params }: EditProductPageProps) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    verdict: "" as "LEGIT" | "OVERHYPED" | "",
    hype_score: 1,
    tagline: "",
    website_url: "",
    full_review: "",
    description: "",
    primary_use_case: "",
    pricing: "",
    pros: [""],
    cons: [""],
    screenshots: [] as { id?: number, image_url: string, caption: string }[]
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/signin')
      return
    }

    fetchProduct()
  }, [session, status, router, resolvedParams.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${resolvedParams.id}`)
      if (response.ok) {
        const product = await response.json()
        
        // Fetch screenshots for this product
        const screenshotsResponse = await fetch(`/api/admin/products/${resolvedParams.id}/screenshots`)
        const screenshots = screenshotsResponse.ok ? await screenshotsResponse.json() : []
        
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          category: product.category || "",
          verdict: product.verdict || "",
          hype_score: product.hype_score || 1,
          tagline: product.tagline || "",
          website_url: product.website_url || "",
          full_review: product.full_review || "",
          description: product.description || "",
          primary_use_case: product.primary_use_case || "",
          pricing: product.pricing || "",
          pros: product.pros && product.pros.length > 0 ? product.pros : [""],
          cons: product.cons && product.cons.length > 0 ? product.cons : [""],
          screenshots: screenshots
        })
      } else {
        alert('Product not found')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Error loading product')
      router.push('/admin/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'hype_score' ? parseInt(value) : value 
    }))
  }

  const handleArrayChange = (field: 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleScreenshotChange = (index: number, field: 'image_url' | 'caption', value: string) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.map((screenshot, i) => 
        i === index ? { ...screenshot, [field]: value } : screenshot
      )
    }))
  }

  const addScreenshot = () => {
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, { image_url: '', caption: '' }]
    }))
  }

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty pros and cons
      const cleanedData = {
        ...formData,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        cons: formData.cons.filter(con => con.trim() !== '')
      }

      const response = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      if (response.ok) {
        // Update screenshots separately
        const screenshotsResponse = await fetch(`/api/admin/products/${resolvedParams.id}/screenshots`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screenshots: cleanedData.screenshots.filter(s => s.image_url)
          }),
        })

        if (!screenshotsResponse.ok) {
          console.error('Failed to update screenshots')
        }

        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product: {formData.name}</h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cursor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., cursor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline *</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description that appears on the homepage"
              />
            </div>
          </div>

          {/* Review & Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Review & Rating</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verdict *</label>
                <select
                  name="verdict"
                  value={formData.verdict}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select verdict</option>
                  <option value="LEGIT">LEGIT</option>
                  <option value="OVERHYPED">OVERHYPED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hype Score (1-5) *</label>
                <select
                  name="hype_score"
                  value={formData.hype_score}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(score => (
                    <option key={score} value={score}>{score} star{score !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Review *</label>
              <textarea
                name="full_review"
                value={formData.full_review}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your detailed review here..."
              />
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-600">Pros</h2>
                <Button
                  type="button"
                  onClick={() => addArrayItem('pros')}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter a pro..."
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem('pros', index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-red-600">Cons</h2>
                <Button
                  type="button"
                  onClick={() => addArrayItem('cons')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter a con..."
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem('cons', index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Screenshots
              </h2>
              <Button
                type="button"
                onClick={addScreenshot}
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Screenshot
              </Button>
            </div>
            
            {formData.screenshots.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No screenshots added yet. Click &quot;Add Screenshot&quot; to add product images.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-700">Screenshot {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Upload Image or Enter URL</label>
                      
                      {/* Image Upload Component */}
                      <div className="mb-3">
                        <ImageUpload
                          onImageUploaded={(imageUrl) => handleScreenshotChange(index, 'image_url', imageUrl)}
                          currentImageUrl={screenshot.image_url}
                          onRemove={() => handleScreenshotChange(index, 'image_url', '')}
                        />
                      </div>
                      
                      {/* URL Input as Alternative */}
                      <div className="text-center text-sm text-gray-500 my-2">or</div>
                      <input
                        type="text"
                        value={screenshot.image_url}
                        onChange={(e) => handleScreenshotChange(index, 'image_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/screenshot.png"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Caption (optional)</label>
                      <input
                        type="text"
                        value={screenshot.caption}
                        onChange={(e) => handleScreenshotChange(index, 'caption', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dashboard view showing AI suggestions"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}