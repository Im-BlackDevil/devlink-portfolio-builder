import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
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