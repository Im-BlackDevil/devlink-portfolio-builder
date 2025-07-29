import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Disable static generation for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { format } = await request.json()

    // Skip database access during build
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    // Fetch portfolio data with all related content
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: {
        user: true,
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

    if (format === 'pdf') {
      // Generate PDF
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(24)
      doc.text(portfolio.name || portfolio.title || 'Portfolio', 20, 30)
      
      // Add professional title
      if (portfolio.bio) {
        doc.setFontSize(14)
        doc.text(portfolio.bio, 20, 45)
      }
      
      // Add basic info
      doc.setFontSize(12)
      let yPosition = 65
      doc.text(`Email: ${portfolio.email || 'N/A'}`, 20, yPosition)
      yPosition += 10
      doc.text(`Phone: ${portfolio.phone || 'N/A'}`, 20, yPosition)
      yPosition += 10
      doc.text(`Location: ${portfolio.location || 'N/A'}`, 20, yPosition)
      yPosition += 15
      
      // Add about section
      if (portfolio.about && portfolio.about.content) {
        doc.setFontSize(16)
        doc.text('About Me', 20, yPosition)
        yPosition += 10
        doc.setFontSize(10)
        const aboutText = portfolio.about.content
        const splitText = doc.splitTextToSize(aboutText, 170)
        doc.text(splitText, 20, yPosition)
        yPosition += splitText.length * 5 + 10
      }
      
      // Add skills section
      if (portfolio.skills && portfolio.skills.length > 0) {
        doc.setFontSize(16)
        doc.text('Skills', 20, yPosition)
        yPosition += 10
        doc.setFontSize(10)
        const skillsText = portfolio.skills.map((skill: any) => skill.name).join(', ')
        const splitSkills = doc.splitTextToSize(skillsText, 170)
        doc.text(splitSkills, 20, yPosition)
        yPosition += splitSkills.length * 5 + 10
      }
      
      // Add projects section
      if (portfolio.projects && portfolio.projects.length > 0) {
        doc.setFontSize(16)
        doc.text('Projects', 20, yPosition)
        yPosition += 10
        doc.setFontSize(10)
        portfolio.projects.forEach((project: any, index: number) => {
          doc.setFontSize(12)
          doc.text(`${index + 1}. ${project.title}`, 20, yPosition)
          yPosition += 8
          doc.setFontSize(10)
          const projectDesc = project.description || ''
          const splitDesc = doc.splitTextToSize(projectDesc, 170)
          doc.text(splitDesc, 25, yPosition)
          yPosition += splitDesc.length * 5 + 5
        })
      }

      // Convert to buffer
      const pdfBuffer = doc.output('arraybuffer')
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${portfolio.name || 'portfolio'}.pdf"`,
        },
      })
    } else if (format === 'html') {
      // Generate HTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${portfolio.name || portfolio.title || 'Portfolio'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            .section { margin: 20px 0; }
            .contact-info { background: #f8f9fa; padding: 15px; border-radius: 5px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #007bff; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
            .project { border-left: 3px solid #007bff; padding-left: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <h1>${portfolio.name || portfolio.title || 'Portfolio'}</h1>
          ${portfolio.bio ? `<p style="font-size: 18px; color: #666; margin-bottom: 20px;">${portfolio.bio}</p>` : ''}
          
          <div class="section contact-info">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> ${portfolio.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${portfolio.phone || 'N/A'}</p>
            <p><strong>Location:</strong> ${portfolio.location || 'N/A'}</p>
          </div>
          
          ${portfolio.about && portfolio.about.content ? `
          <div class="section">
            <h2>About Me</h2>
            <p>${portfolio.about.content}</p>
          </div>
          ` : ''}
          
          ${portfolio.skills && portfolio.skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills">
              ${portfolio.skills.map((skill: any) => `<span class="skill">${skill.name}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          ${portfolio.projects && portfolio.projects.length > 0 ? `
          <div class="section">
            <h2>Projects</h2>
            ${portfolio.projects.map((project: any, index: number) => `
              <div class="project">
                <h3>${index + 1}. ${project.title}</h3>
                <p>${project.description || ''}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </body>
        </html>
      `

      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${portfolio.name || 'portfolio'}.html"`,
        },
      })
    }

    return NextResponse.json(
      { message: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { message: 'Failed to export portfolio' },
      { status: 500 }
    )
  }
} 