'use client'

import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface PortfolioPreviewProps {
  portfolio: any
}

export default function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  const socialLinks = [
    { name: 'GitHub', url: portfolio.github, icon: '🐙' },
    { name: 'LinkedIn', url: portfolio.linkedin, icon: '💼' },
    { name: 'Twitter', url: portfolio.twitter, icon: '🐦' },
    { name: 'Website', url: portfolio.website, icon: '🌐' },
  ].filter(link => link.url)

  return (
    <div className="portfolio-preview">
      {/* Header */}
      <div className="header">
        <div className="text-center">
          {portfolio.avatar && (
            <img
              src={portfolio.avatar}
              alt={portfolio.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{portfolio.name || 'Your Name'}</h1>
          <p className="text-xl opacity-90 mb-4">{portfolio.professionalTitle || 'Professional Title'}</p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-90">
            {portfolio.email && (
              <div className="flex items-center space-x-1">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{portfolio.email}</span>
              </div>
            )}
            {portfolio.phone && (
              <div className="flex items-center space-x-1">
                <PhoneIcon className="h-4 w-4" />
                <span>{portfolio.phone}</span>
              </div>
            )}
            {portfolio.location && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{portfolio.location}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <span className="text-lg">{link.icon}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {/* About Section */}
        {portfolio.about?.content && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              {portfolio.about.content}
            </p>
          </motion.section>
        )}

        {/* Experience Section */}
        {portfolio.experience?.length > 0 && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="section-title">Experience</h2>
            <div className="space-y-6">
              {portfolio.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-primary-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {portfolio.skills?.length > 0 && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.skills.map((skill: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.category}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {portfolio.projects?.length > 0 && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="section-title">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((project: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    {project.featured && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                  <div className="flex space-x-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {portfolio.education?.length > 0 && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="section-title">Education</h2>
            <div className="space-y-4">
              {portfolio.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications?.length > 0 && (
          <motion.section 
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="section-title">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.certifications.map((cert: any, index: number) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                  <p className="text-yellow-700 font-medium text-sm mb-2">{cert.issuer}</p>
                  <p className="text-gray-600 text-sm">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:text-yellow-700 text-sm"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
} 