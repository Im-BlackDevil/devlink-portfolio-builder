'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Portfolio {
  id: string
  title: string
  slug: string
  template: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    fetchPortfolios()
  }, [status, session])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data.portfolios)
      }
    } catch (error) {
      toast.error('Failed to load portfolios')
    } finally {
      setIsLoading(false)
    }
  }

  const createPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'My Portfolio',
          template: 'modern',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Portfolio created successfully!')
        router.push(`/dashboard/portfolio/${data.portfolio.id}`)
      } else {
        toast.error('Failed to create portfolio')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return

    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Portfolio deleted successfully!')
        setPortfolios(portfolios.filter(p => p.id !== id))
      } else {
        toast.error('Failed to delete portfolio')
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
          <p className="text-gray-600">Loading...</p>
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
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DevLink</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolios</h1>
          <p className="text-gray-600">Create and manage your developer portfolios</p>
        </div>

        {/* Create New Portfolio */}
        <motion.div
          className="mb-8 flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={createPortfolio}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create New Portfolio</span>
          </button>
          
          <Link
            href="/dashboard/templates"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Choose Template</span>
          </Link>
        </motion.div>

        {/* Portfolios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Template: {portfolio.template}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    portfolio.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {portfolio.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/portfolio/${portfolio.id}`}
                  className="flex-1 flex items-center justify-center space-x-1 bg-primary-50 text-primary-600 px-3 py-2 rounded-md hover:bg-primary-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                <Link
                  href={`/portfolio/${portfolio.slug}`}
                  target="_blank"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button
                  onClick={() => deletePortfolio(portfolio.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {portfolios.length === 0 && !isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first portfolio to get started
            </p>
            <button
              onClick={createPortfolio}
              className="btn-primary"
            >
              Create Your First Portfolio
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
} 