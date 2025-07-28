import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, context, userDetails } = await request.json()

    let content = ''

    if (type === 'about') {
      // Generate personalized about content based on user details
      const { name, professionalTitle, location, education, experience, skills, hobbies, goals } = userDetails || {}
      
      content = generatePersonalizedAbout({
        name: name || 'the developer',
        professionalTitle: professionalTitle || 'developer',
        location: location || 'their location',
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        hobbies: hobbies || [],
        goals: goals || []
      })
    } else if (type === 'project') {
      content = generateProjectDescription(context)
    } else {
      content = 'Generated content based on your input.'
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { message: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generatePersonalizedAbout(details: any) {
  const { name, professionalTitle, location, education, experience, skills, hobbies, goals } = details
  
  let about = `I'm ${name}, a passionate ${professionalTitle} based in ${location}. `
  
  // Add education context
  if (education && education.length > 0) {
    const latestEdu = education[0]
    about += `I'm currently pursuing ${latestEdu.degree} in ${latestEdu.field || 'Computer Science'} at ${latestEdu.institution}. `
  }
  
  // Add experience context
  if (experience && experience.length > 0) {
    const latestExp = experience[0]
    about += `I work as a ${latestExp.position} at ${latestExp.company}, where I focus on ${latestExp.technologies || 'various technologies'}. `
  }
  
  // Add skills context
  if (skills && skills.length > 0) {
    const skillNames = skills.map((s: any) => s.name).join(', ')
    about += `My technical expertise includes ${skillNames}. `
  }
  
  // Add personal interests
  if (hobbies && hobbies !== '') {
    const hobbiesList = hobbies.split(',').map((h: string) => h.trim())
    about += `When I'm not coding, I enjoy ${hobbiesList.join(', ')}. `
  }
  
  // Add goals
  if (goals && goals !== '') {
    const goalsList = goals.split(',').map((g: string) => g.trim())
    about += `My goal is to ${goalsList.join(' and ')}. `
  }
  
  // Add a generic closing
  about += `I'm always eager to learn new technologies and take on challenging projects that push the boundaries of what I can create.`
  
  return about
}

function generateProjectDescription(context: string) {
  return `A comprehensive project that demonstrates modern development practices and innovative solutions. Built with cutting-edge technologies and designed for scalability and performance.`
} 