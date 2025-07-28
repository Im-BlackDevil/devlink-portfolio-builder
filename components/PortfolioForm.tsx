'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  TrashIcon, 
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PortfolioFormProps {
  portfolio: any
  onSave: (data: any) => void
  isSaving: boolean
}

export default function PortfolioForm({ portfolio, onSave, isSaving }: PortfolioFormProps) {
  const [formData, setFormData] = useState(portfolio)
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal'])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const sections = [
    { id: 'personal', title: 'Personal Information', icon: '👤' },
    { id: 'about', title: 'About Me', icon: '📝' },
    { id: 'experience', title: 'Experience', icon: '💼' },
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'skills', title: 'Skills', icon: '⚡' },
    { id: 'projects', title: 'Projects', icon: '🚀' },
    { id: 'certifications', title: 'Certifications', icon: '🏆' },
    { id: 'social', title: 'Social Links', icon: '🔗' },
  ]

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSectionChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const addArrayItem = (section: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...template, id: Date.now() }]
    }))
  }

  const removeArrayItem = (section: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index)
    }))
  }

  const updateArrayItem = (section: string, index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const generateAIContent = async (type: string, context: string) => {
    setIsGeneratingAI(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type, 
          context,
          userDetails: {
            name: formData.name,
            professionalTitle: formData.professionalTitle,
            location: formData.location,
            education: formData.education || [],
            experience: formData.experience || [],
            skills: formData.skills || [],
            hobbies: formData.hobbies || '',
            goals: formData.goals || ''
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'about') {
          handleSectionChange('about', 'content', data.content)
        } else if (type === 'project') {
          // Add to projects array
          addArrayItem('projects', {
            title: 'AI Generated Project',
            description: data.content,
            technologies: [],
            featured: false
          })
        }
        toast.success('AI content generated successfully!')
      } else {
        toast.error('Failed to generate AI content')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sections.map((section) => (
        <motion.div
          key={section.id}
          className="bg-gray-50 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium text-gray-900">{section.title}</span>
            </div>
            {expandedSections.includes(section.id) ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections.includes(section.id) && (
            <motion.div
              className="px-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {section.id === 'personal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={formData.professionalTitle || ''}
                      onChange={(e) => handleChange('professionalTitle', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="input-field"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hobbies & Interests
                    </label>
                    <input
                      type="text"
                      value={formData.hobbies || ''}
                      onChange={(e) => handleChange('hobbies', e.target.value)}
                      className="input-field"
                      placeholder="e.g., reading, gaming, hiking, photography"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Career Goals
                    </label>
                    <input
                      type="text"
                      value={formData.goals || ''}
                      onChange={(e) => handleChange('goals', e.target.value)}
                      className="input-field"
                      placeholder="e.g., become a senior developer, work at a tech company"
                    />
                  </div>
                </div>
              )}

              {section.id === 'about' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      About Me
                    </label>
                    <button
                      type="button"
                      onClick={() => generateAIContent('about', formData.name || 'developer')}
                      disabled={isGeneratingAI}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <SparklesIcon className="h-4 w-4" />
                      <span>{isGeneratingAI ? 'Generating...' : 'Generate with AI'}</span>
                    </button>
                  </div>
                  <textarea
                    value={formData.about?.content || ''}
                    onChange={(e) => handleSectionChange('about', 'content', e.target.value)}
                    className="input-field h-32 resize-none"
                    placeholder="Tell us about yourself, your passion for development, and what drives you..."
                  />
                </div>
              )}

              {section.id === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Work Experience</h4>
                    <button
                      type="button"
                      onClick={() => addArrayItem('experience', {
                        company: '',
                        position: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        isCurrent: false,
                        description: '',
                        technologies: []
                      })}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                  {formData.experience?.map((exp: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Experience #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                          className="input-field"
                          placeholder="Company name"
                        />
                        <input
                          type="text"
                          value={exp.position || ''}
                          onChange={(e) => updateArrayItem('experience', index, 'position', e.target.value)}
                          className="input-field"
                          placeholder="Job title"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                          className="input-field"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateArrayItem('experience', index, 'startDate', e.target.value)}
                          className="input-field"
                          placeholder="Start date (MM/YYYY)"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateArrayItem('experience', index, 'endDate', e.target.value)}
                          className="input-field"
                          placeholder="End date (MM/YYYY)"
                          disabled={exp.isCurrent}
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent || false}
                            onChange={(e) => updateArrayItem('experience', index, 'isCurrent', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Current position</span>
                        </label>
                      </div>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                        className="input-field h-20 resize-none"
                        placeholder="Describe your role and achievements..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.id === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Skills</h4>
                    <button
                      type="button"
                      onClick={() => addArrayItem('skills', {
                        name: '',
                        category: 'technical',
                        level: 3
                      })}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                  {formData.skills?.map((skill: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Skill #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={skill.name || ''}
                          onChange={(e) => updateArrayItem('skills', index, 'name', e.target.value)}
                          className="input-field"
                          placeholder="Skill name"
                        />
                        <select
                          value={skill.category || 'technical'}
                          onChange={(e) => updateArrayItem('skills', index, 'category', e.target.value)}
                          className="input-field"
                        >
                          <option value="technical">Technical</option>
                          <option value="soft">Soft Skills</option>
                          <option value="language">Languages</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proficiency Level (1-5)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={skill.level || 3}
                          onChange={(e) => updateArrayItem('skills', index, 'level', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.id === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Projects</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => generateAIContent('project', formData.name || 'developer')}
                        disabled={isGeneratingAI}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <SparklesIcon className="h-4 w-4" />
                        <span>{isGeneratingAI ? 'Generating...' : 'AI Project'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addArrayItem('projects', {
                          title: '',
                          description: '',
                          url: '',
                          github: '',
                          technologies: [],
                          featured: false
                        })}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>
                  {formData.projects?.map((project: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Project #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('projects', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={project.title || ''}
                        onChange={(e) => updateArrayItem('projects', index, 'title', e.target.value)}
                        className="input-field"
                        placeholder="Project title"
                      />
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                        className="input-field h-20 resize-none"
                        placeholder="Project description..."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={project.url || ''}
                          onChange={(e) => updateArrayItem('projects', index, 'url', e.target.value)}
                          className="input-field"
                          placeholder="Live URL"
                        />
                        <input
                          type="url"
                          value={project.github || ''}
                          onChange={(e) => updateArrayItem('projects', index, 'github', e.target.value)}
                          className="input-field"
                          placeholder="GitHub URL"
                        />
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={project.featured || false}
                          onChange={(e) => updateArrayItem('projects', index, 'featured', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Featured project</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {section.id === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Education</h4>
                    <button
                      type="button"
                      onClick={() => addArrayItem('education', {
                        institution: '',
                        degree: '',
                        field: '',
                        startDate: '',
                        endDate: '',
                        gpa: '',
                        description: ''
                      })}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Education</span>
                    </button>
                  </div>
                  {formData.education?.map((edu: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Education #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
                        className="input-field"
                        placeholder="Institution name"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                          className="input-field"
                          placeholder="Degree (e.g., Bachelor's)"
                        />
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => updateArrayItem('education', index, 'field', e.target.value)}
                          className="input-field"
                          placeholder="Field of study"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.startDate || ''}
                          onChange={(e) => updateArrayItem('education', index, 'startDate', e.target.value)}
                          className="input-field"
                          placeholder="Start date (MM/YYYY)"
                        />
                        <input
                          type="text"
                          value={edu.endDate || ''}
                          onChange={(e) => updateArrayItem('education', index, 'endDate', e.target.value)}
                          className="input-field"
                          placeholder="End date (MM/YYYY)"
                        />
                      </div>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateArrayItem('education', index, 'gpa', e.target.value)}
                        className="input-field"
                        placeholder="GPA (optional)"
                      />
                      <textarea
                        value={edu.description || ''}
                        onChange={(e) => updateArrayItem('education', index, 'description', e.target.value)}
                        className="input-field h-20 resize-none"
                        placeholder="Description of your studies, achievements, or relevant coursework..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.id === 'certifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Certifications</h4>
                    <button
                      type="button"
                      onClick={() => addArrayItem('certifications', {
                        name: '',
                        issuer: '',
                        date: '',
                        url: '',
                        description: ''
                      })}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Certification</span>
                    </button>
                  </div>
                  {formData.certifications?.map((cert: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Certification #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('certifications', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cert.name || ''}
                        onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)}
                        className="input-field"
                        placeholder="Certification name"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cert.issuer || ''}
                          onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                          className="input-field"
                          placeholder="Issuing organization"
                        />
                        <input
                          type="text"
                          value={cert.date || ''}
                          onChange={(e) => updateArrayItem('certifications', index, 'date', e.target.value)}
                          className="input-field"
                          placeholder="Date earned (MM/YYYY)"
                        />
                      </div>
                      <input
                        type="url"
                        value={cert.url || ''}
                        onChange={(e) => updateArrayItem('certifications', index, 'url', e.target.value)}
                        className="input-field"
                        placeholder="Verification URL (optional)"
                      />
                      <textarea
                        value={cert.description || ''}
                        onChange={(e) => updateArrayItem('certifications', index, 'description', e.target.value)}
                        className="input-field h-20 resize-none"
                        placeholder="Description of the certification and skills covered..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.id === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github || ''}
                      onChange={(e) => handleChange('github', e.target.value)}
                      className="input-field"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      className="input-field"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.twitter || ''}
                      onChange={(e) => handleChange('twitter', e.target.value)}
                      className="input-field"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="input-field"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Portfolio'}
        </button>
      </div>
    </form>
  )
} 