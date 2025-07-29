import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Disable static generation for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      },
      include: {
        about: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
      }
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    const data = await request.json()

    // Update basic portfolio fields
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: {
        title: data.title,
        template: data.template,
        isPublic: data.isPublic,
        name: data.name,
        professionalTitle: data.professionalTitle,
        email: data.email,
        phone: data.phone,
        location: data.location,
        avatar: data.avatar,
        bio: data.bio,
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        website: data.website,
      }
    })

    // Update About section
    if (data.about) {
      await prisma.about.upsert({
        where: { portfolioId: params.id },
        update: { content: data.about.content },
        create: { portfolioId: params.id, content: data.about.content }
      })
    }

    // Update Skills
    if (data.skills && Array.isArray(data.skills)) {
      // Delete existing skills
      await prisma.skill.deleteMany({ where: { portfolioId: params.id } })
      // Create new skills
      if (data.skills.length > 0) {
        await prisma.skill.createMany({
          data: data.skills.map((skill: any) => ({
            portfolioId: params.id,
            name: skill.name,
            category: skill.category || 'technical',
            level: skill.level || 3
          }))
        })
      }
    }

    // Update Projects
    if (data.projects && Array.isArray(data.projects)) {
      // Delete existing projects
      await prisma.project.deleteMany({ where: { portfolioId: params.id } })
      // Create new projects
      if (data.projects.length > 0) {
        await prisma.project.createMany({
          data: data.projects.map((project: any) => ({
            portfolioId: params.id,
            title: project.title,
            description: project.description,
            image: project.image,
            url: project.url,
            github: project.github,
            technologies: project.technologies,
            featured: project.featured || false
          }))
        })
      }
    }

    // Update Experience
    if (data.experience && Array.isArray(data.experience)) {
      // Delete existing experience
      await prisma.experience.deleteMany({ where: { portfolioId: params.id } })
      // Create new experience
      if (data.experience.length > 0) {
        await prisma.experience.createMany({
          data: data.experience.map((exp: any) => ({
            portfolioId: params.id,
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            isCurrent: exp.isCurrent || false,
            description: exp.description,
            technologies: exp.technologies
          }))
        })
      }
    }

    // Update Education
    if (data.education && Array.isArray(data.education)) {
      // Delete existing education
      await prisma.education.deleteMany({ where: { portfolioId: params.id } })
      // Create new education
      if (data.education.length > 0) {
        await prisma.education.createMany({
          data: data.education.map((edu: any) => ({
            portfolioId: params.id,
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            isCurrent: edu.isCurrent || false,
            gpa: edu.gpa,
            description: edu.description
          }))
        })
      }
    }

    // Update Certifications
    if (data.certifications && Array.isArray(data.certifications)) {
      // Delete existing certifications
      await prisma.certification.deleteMany({ where: { portfolioId: params.id } })
      // Create new certifications
      if (data.certifications.length > 0) {
        await prisma.certification.createMany({
          data: data.certifications.map((cert: any) => ({
            portfolioId: params.id,
            name: cert.name,
            issuer: cert.issuer,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            url: cert.url
          }))
        })
      }
    }

    return NextResponse.json({ portfolio: updatedPortfolio })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    await prisma.portfolio.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 