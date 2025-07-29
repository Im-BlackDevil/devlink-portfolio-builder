import { NextRequest, NextResponse } from 'next/server'

// Disable static generation for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Prevent any static generation attempts
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        slug: params.slug,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        about: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
      },
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 