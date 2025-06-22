"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  User,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Submission {
  id: number
  submission_type: 'legacy' | 'workflow'
  title: string  // tool_name for legacy, title for workflow
  website_url?: string
  category: string
  description: string
  why_review: string
  your_role?: string
  email?: string
  additional_info?: string
  status: 'pending' | 'reviewing' | 'reviewed' | 'rejected' | 'approved'
  created_at: string
  updated_at: string
  // Workflow-specific fields
  workflow_type?: string
  content?: string
  tools_used?: string
  github_url?: string
  reviewer_notes?: string
}

export default function SubmissionsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'reviewed' | 'rejected' | 'approved'>('all')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/signin')
      return
    }

    fetchSubmissions()
  }, [session, status, router])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubmissionStatus = async (submission: Submission, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          submission_type: submission.submission_type
        }),
      })

      if (response.ok) {
        setSubmissions(submissions.map(sub => 
          sub.id === submission.id 
            ? { ...sub, status: newStatus as Submission['status'], updated_at: new Date().toISOString() }
            : sub
        ))
      } else {
        alert('Failed to update submission status')
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      alert('Error updating submission')
    }
  }

  const deleteSubmission = async (submission: Submission) => {
    if (!confirm(`Are you sure you want to delete the submission "${submission.title}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}?type=${submission.submission_type}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSubmissions(submissions.filter(sub => sub.id !== submission.id))
      } else {
        alert('Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert('Error deleting submission')
    }
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'reviewing':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'reviewed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-green-100 text-green-900'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true
    return submission.status === filter
  })

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
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900">Submissions Review</h1>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'reviewing', 'reviewed', 'approved', 'rejected'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as typeof filter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  {filterOption !== 'all' && (
                    <span className="ml-1 text-xs">
                      ({submissions.filter(s => s.status === filterOption).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} submissions
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? "No pending submissions to review." 
                : filter === 'all' 
                ? "No submissions have been received yet."
                : `No submissions with status "${filter}".`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{submission.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        submission.submission_type === 'workflow' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.submission_type === 'workflow' ? 'Workflow' : 'Tool'}
                      </span>
                    </div>
                    {submission.website_url && (
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {submission.github_url && (
                      <a
                        href={submission.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="GitHub Repository"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {submission.submission_type === 'workflow' ? 'Workflow Type' : 'Category'}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {submission.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {submission.submission_type === 'workflow' && submission.tools_used && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tools Used</h4>
                      <p className="text-sm text-gray-600">{submission.tools_used}</p>
                    </div>
                  )}

                  {submission.your_role && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Submitter Role</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        {submission.your_role}
                      </div>
                    </div>
                  )}

                  {submission.email && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Email</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        <a href={`mailto:${submission.email}`} className="text-blue-600 hover:text-blue-800">
                          {submission.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{submission.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Why Review This Tool?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{submission.why_review}</p>
                  </div>

                  {submission.additional_info && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{submission.additional_info}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => updateSubmissionStatus(submission, 'reviewing')}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Review
                        </Button>
                        <Button
                          onClick={() => updateSubmissionStatus(submission, 'rejected')}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {submission.status === 'reviewing' && (
                      <>
                        <Button
                          onClick={() => updateSubmissionStatus(submission, submission.submission_type === 'workflow' ? 'approved' : 'reviewed')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {submission.submission_type === 'workflow' ? 'Approve' : 'Mark as Reviewed'}
                        </Button>
                        <Button
                          onClick={() => updateSubmissionStatus(submission, 'pending')}
                          size="sm"
                          variant="outline"
                        >
                          Back to Pending
                        </Button>
                      </>
                    )}

                    {(submission.status === 'reviewed' || submission.status === 'rejected' || submission.status === 'approved') && (
                      <Button
                        onClick={() => updateSubmissionStatus(submission, 'pending')}
                        size="sm"
                        variant="outline"
                      >
                        Reopen
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={() => deleteSubmission(submission)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}