'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'
import PortfolioForm from '@/components/PortfolioForm'
import PortfolioPreview from '@/components/PortfolioPreview'

interface Portfolio {
  id: string
  title: string
  slug: string
  template: string
  isPublic: boolean
  name?: string
  email?: string
  phone?: string
  location?: string
  avatar?: string
  bio?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  about?: { content: string }
  experience: any[]
  education: any[]
  skills: any[]
  projects: any[]
  certifications: any[]
}

export default function PortfolioBuilderPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    fetchPortfolio()
  }, [status, params.id])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolios/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPortfolio(data.portfolio)
      } else {
        toast.error('Failed to load portfolio')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Something went wrong')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (formData: any) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/portfolios/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Portfolio saved successfully!')
        await fetchPortfolio() // Refresh data
      } else {
        toast.error('Failed to save portfolio')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'html') => {
    try {
      const response = await fetch(`/api/portfolios/${params.id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `portfolio.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`${format.toUpperCase()} exported successfully!`)
      } else {
        toast.error('Failed to export portfolio')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Portfolio not found</p>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {portfolio.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Template: {portfolio.template}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <EyeIcon className="h-5 w-5" />
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    // Make portfolio public first
                    const publishResponse = await fetch(`/api/portfolios/${params.id}/publish`, {
                      method: 'POST',
                    })
                    
                    if (publishResponse.ok) {
                      // Update local state
                      setPortfolio(prev => prev ? { ...prev, isPublic: true } : null)
                      // Open in new tab
                      window.open(`/portfolio/${portfolio.slug}`, '_blank')
                      toast.success('Portfolio is now live!')
                    } else {
                      toast.error('Failed to make portfolio public')
                    }
                  } catch (error) {
                    toast.error('Something went wrong')
                  }
                }}
                className="btn-primary"
              >
                View Live
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Portfolio</h2>
                <button
                  onClick={() => handleSave(portfolio)}
                  disabled={isSaving}
                  className="flex items-center space-x-1 btn-primary disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
              
              <PortfolioForm
                portfolio={portfolio}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </motion.div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <PortfolioPreview portfolio={portfolio} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 