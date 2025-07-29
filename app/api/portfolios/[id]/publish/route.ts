import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Disable static generation for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Prevent any static generation attempts
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({
        message: 'Unauthorized',
        status: 401
      });
    }

    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    if (portfolio.userId !== session.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Make portfolio public
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: { isPublic: true },
    })

    return NextResponse.json({ portfolio: updatedPortfolio })
  } catch (error) {
    console.error('Error publishing portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 