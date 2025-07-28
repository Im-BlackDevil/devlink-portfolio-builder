'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import PortfolioPreview from '@/components/PortfolioPreview'
import toast from 'react-hot-toast'

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

export default function PortfolioPage({ params }: { params: { slug: string } }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [params.slug])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolios/public/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setPortfolio(data.portfolio)
      } else {
        toast.error('Portfolio not found')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'html') => {
    try {
      const response = await fetch(`/api/portfolios/${portfolio?.id}/export`, {
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
        a.download = `${portfolio?.name || 'portfolio'}.${format}`
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: portfolio?.name || 'Portfolio',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-4">The portfolio you're looking for doesn't exist or is private.</p>
          <a href="/" className="text-primary-600 hover:text-primary-700">
            Go back home
          </a>
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
              <a href="/" className="text-gray-600 hover:text-gray-900">
                ← Back to DevLink
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PortfolioPreview portfolio={portfolio} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Created with ❤️ using{' '}
            <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              DevLink
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
} 