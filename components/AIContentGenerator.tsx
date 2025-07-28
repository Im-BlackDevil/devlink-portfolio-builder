'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, PenTool, BookOpen, TrendingUp, Sparkles, Copy, Download, Share2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  challenges: string[];
  solutions: string[];
}

interface Skill {
  name: string;
  proficiency: number;
  category: string;
}

interface AIContentGeneratorProps {
  userSkills: Skill[];
  projects: Project[];
  onContentGenerated: (content: any) => void;
}

interface GeneratedContent {
  id: string;
  type: 'blog' | 'case-study' | 'learning-path' | 'tech-article';
  title: string;
  content: string;
  summary: string;
  tags: string[];
  estimatedReadTime: number;
  generatedAt: Date;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ 
  userSkills, 
  projects, 
  onContentGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const contentTypes = [
    {
      id: 'blog',
      name: 'Technical Blog Post',
      description: 'AI-generated blog post about your latest project or technology insights',
      icon: PenTool,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'case-study',
      name: 'Project Case Study',
      description: 'Detailed case study analyzing your project challenges and solutions',
      icon: BookOpen,
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'learning-path',
      name: 'Learning Roadmap',
      description: 'Personalized learning path based on your skills and career goals',
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'tech-article',
      name: 'Technology Article',
      description: 'In-depth article about emerging technologies in your field',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const generateContent = async () => {
    if (!selectedType || !selectedProject) return;

    setIsGenerating(true);
    setCurrentStep(0);

    try {
      // Simulate AI generation steps
      const steps = [
        'Analyzing project data...',
        'Researching market trends...',
        'Generating content structure...',
        'Writing engaging content...',
        'Optimizing for SEO...',
        'Finalizing and formatting...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const content = await performAIGeneration(selectedType, selectedProject);
      setGeneratedContent(content);
      onContentGenerated(content);
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const performAIGeneration = async (type: string, project: Project): Promise<GeneratedContent> => {
    // Simulate AI content generation
    const contentMap = {
      blog: generateBlogPost(project),
      'case-study': generateCaseStudy(project),
      'learning-path': generateLearningPath(userSkills),
      'tech-article': generateTechArticle(project)
    };

    return contentMap[type as keyof typeof contentMap] || contentMap.blog;
  };

  const generateBlogPost = (project: Project): GeneratedContent => {
    const title = `Building ${project.name}: A Deep Dive into Modern Web Development`;
    const content = `
# Building ${project.name}: A Deep Dive into Modern Web Development

## Introduction

In today's rapidly evolving tech landscape, building robust and scalable applications requires more than just coding skills. It demands a deep understanding of modern development practices, architectural patterns, and the ability to solve complex problems efficiently.

In this post, I'll share my journey building **${project.name}**, a project that challenged me to think beyond conventional approaches and embrace cutting-edge technologies.

## The Challenge

${project.challenges.map(challenge => `- ${challenge}`).join('\n')}

## Technical Stack

The project leverages a modern tech stack including:
${project.technologies.map(tech => `- **${tech}**: For ${getTechDescription(tech)}`).join('\n')}

## Architecture Decisions

### 1. Scalable Design Patterns
Implementing scalable design patterns was crucial for handling the project's requirements. I chose to use:
- **Component-based architecture** for maintainability
- **State management patterns** for predictable data flow
- **API-first design** for flexibility

### 2. Performance Optimization
Performance was a key consideration from the start:
- Implemented lazy loading for better initial load times
- Used code splitting to reduce bundle sizes
- Optimized database queries for faster data retrieval

## Key Solutions

${project.solutions.map((solution, index) => `
### Solution ${index + 1}
${solution}

This approach not only solved the immediate problem but also provided a foundation for future enhancements.
`).join('\n')}

## Lessons Learned

### 1. Planning is Everything
Proper planning and architecture design saved countless hours during development.

### 2. Testing Early and Often
Implementing comprehensive testing from the start prevented many bugs and made refactoring much easier.

### 3. Documentation Matters
Good documentation is invaluable, especially when working in teams or planning for future maintenance.

## Results and Impact

The project successfully achieved its goals and provided valuable insights into modern web development practices. Key metrics include:
- **Performance**: 95% improvement in load times
- **Maintainability**: 80% reduction in bug reports
- **User Experience**: 90% positive feedback

## Future Enhancements

Looking ahead, I'm planning several enhancements:
- Integration with AI/ML capabilities
- Enhanced mobile experience
- Advanced analytics and reporting

## Conclusion

Building ${project.name} was an incredible learning experience that reinforced the importance of modern development practices, proper planning, and continuous learning. The challenges faced and solutions implemented have become valuable assets in my development toolkit.

The journey doesn't end here - every project is an opportunity to learn, grow, and push the boundaries of what's possible in web development.

---

*What challenges have you faced in your recent projects? I'd love to hear about your experiences and solutions in the comments below!*
    `;

    return {
      id: Date.now().toString(),
      type: 'blog',
      title,
      content,
      summary: `A comprehensive blog post about building ${project.name}, covering technical challenges, solutions, and lessons learned in modern web development.`,
      tags: [...project.technologies, 'web-development', 'case-study', 'learning'],
      estimatedReadTime: 8,
      generatedAt: new Date()
    };
  };

  const generateCaseStudy = (project: Project): GeneratedContent => {
    const title = `${project.name}: A Comprehensive Case Study`;
    const content = `
# ${project.name}: A Comprehensive Case Study

## Executive Summary

This case study examines the development of ${project.name}, a project that demonstrates modern software development practices and problem-solving approaches. The project showcases how strategic thinking, technical expertise, and innovative solutions can overcome complex challenges.

## Project Overview

### Background
${project.description}

### Objectives
- Deliver a high-performance, scalable solution
- Implement modern development practices
- Create an intuitive user experience
- Ensure maintainability and extensibility

### Scope
The project encompassed full-stack development, including:
- Frontend user interface
- Backend API development
- Database design and optimization
- DevOps and deployment automation

## Technical Analysis

### Technology Stack
${project.technologies.map(tech => `- **${tech}**: ${getTechDescription(tech)}`).join('\n')}

### Architecture Overview
The project follows a modern microservices architecture with:
- **Frontend**: React-based SPA with TypeScript
- **Backend**: Node.js/Express API with RESTful design
- **Database**: PostgreSQL with optimized schemas
- **Infrastructure**: Docker containers with Kubernetes orchestration

## Challenges and Solutions

### Challenge 1: ${project.challenges[0]}
**Problem**: ${project.challenges[0]}

**Solution**: ${project.solutions[0]}

**Impact**: This solution improved performance by 40% and reduced maintenance overhead.

### Challenge 2: ${project.challenges[1] || 'Scalability Issues'}
**Problem**: ${project.challenges[1] || 'Handling increased user load and data volume'}

**Solution**: ${project.solutions[1] || 'Implemented caching strategies and database optimization'}

**Impact**: Achieved 99.9% uptime and reduced response times by 60%.

## Implementation Strategy

### Phase 1: Foundation (Weeks 1-2)
- Set up development environment
- Establish coding standards and practices
- Create basic project structure

### Phase 2: Core Development (Weeks 3-6)
- Implement core features
- Develop API endpoints
- Create user interface components

### Phase 3: Testing and Optimization (Weeks 7-8)
- Comprehensive testing suite
- Performance optimization
- Security audit and fixes

### Phase 4: Deployment and Launch (Weeks 9-10)
- Production deployment
- Monitoring setup
- User feedback collection

## Results and Metrics

### Performance Metrics
- **Load Time**: Reduced from 3.2s to 0.8s (75% improvement)
- **Throughput**: Increased from 100 to 500 requests/second
- **Error Rate**: Reduced from 2.1% to 0.1%

### User Experience Metrics
- **User Satisfaction**: 4.8/5 rating
- **Task Completion Rate**: 95%
- **Return User Rate**: 78%

### Technical Metrics
- **Code Coverage**: 92%
- **Build Time**: Reduced by 60%
- **Deployment Frequency**: Increased to 3x per day

## Lessons Learned

### What Worked Well
1. **Early Planning**: Comprehensive planning saved significant time
2. **Testing Strategy**: Automated testing prevented many issues
3. **Documentation**: Good documentation facilitated team collaboration

### Areas for Improvement
1. **Initial Architecture**: Could have been more scalable from the start
2. **Performance Monitoring**: Should have implemented earlier
3. **User Feedback**: Could have gathered more user input during development

## Future Recommendations

### Short-term (3-6 months)
- Implement advanced analytics
- Add mobile app version
- Enhance security features

### Long-term (6-12 months)
- AI/ML integration
- Internationalization
- Advanced customization options

## Conclusion

The ${project.name} project successfully demonstrated the value of modern development practices, strategic planning, and innovative problem-solving. The lessons learned and solutions implemented provide a solid foundation for future projects.

The project not only met its objectives but exceeded expectations, delivering a robust, scalable, and user-friendly solution that continues to evolve and improve.

---

*This case study serves as a reference for similar projects and demonstrates the importance of combining technical expertise with strategic thinking in software development.*
    `;

    return {
      id: Date.now().toString(),
      type: 'case-study',
      title,
      content,
      summary: `A detailed case study analyzing the development of ${project.name}, including challenges, solutions, and measurable results.`,
      tags: [...project.technologies, 'case-study', 'project-analysis', 'development'],
      estimatedReadTime: 12,
      generatedAt: new Date()
    };
  };

  const generateLearningPath = (skills: Skill[]): GeneratedContent => {
    const title = 'Personalized Learning Roadmap: From Current Skills to Career Excellence';
    const content = `
# Personalized Learning Roadmap: From Current Skills to Career Excellence

## Current Skill Assessment

Based on your current skill set, I've analyzed your proficiency levels and identified key areas for growth and development.

### Current Strengths
${skills.filter(s => s.proficiency > 70).map(skill => `- **${skill.name}**: ${skill.proficiency}% proficiency`).join('\n')}

### Areas for Development
${skills.filter(s => s.proficiency < 70).map(skill => `- **${skill.name}**: ${skill.proficiency}% proficiency`).join('\n')}

## Learning Roadmap

### Phase 1: Foundation Strengthening (Months 1-3)

#### Week 1-4: Core Concepts
- **Focus**: Strengthen fundamental programming concepts
- **Resources**: 
  - Advanced JavaScript courses
  - Data structures and algorithms practice
  - System design fundamentals

#### Week 5-8: Advanced Patterns
- **Focus**: Design patterns and best practices
- **Resources**:
  - Design patterns in software development
  - Clean code principles
  - Testing strategies

#### Week 9-12: Architecture
- **Focus**: System architecture and scalability
- **Resources**:
  - Microservices architecture
  - Cloud computing fundamentals
  - Database optimization

### Phase 2: Specialization (Months 4-6)

#### Frontend Excellence
- **React Advanced Patterns**
- **State Management (Redux, Zustand)**
- **Performance Optimization**
- **Accessibility Standards**

#### Backend Mastery
- **API Design Principles**
- **Database Design**
- **Security Best Practices**
- **DevOps Fundamentals**

#### Full-Stack Integration
- **End-to-End Testing**
- **CI/CD Pipelines**
- **Monitoring and Logging**
- **Performance Monitoring**

### Phase 3: Advanced Topics (Months 7-9)

#### Emerging Technologies
- **AI/ML Integration**
- **Blockchain Development**
- **IoT Applications**
- **Progressive Web Apps**

#### Leadership Skills
- **Technical Leadership**
- **Project Management**
- **Team Collaboration**
- **Mentoring Others**

### Phase 4: Mastery and Innovation (Months 10-12)

#### Expert-Level Skills
- **System Design at Scale**
- **Performance Engineering**
- **Security Architecture**
- **Cloud Native Development**

#### Innovation and Research
- **Emerging Technology Research**
- **Open Source Contributions**
- **Technical Writing**
- **Conference Speaking**

## Recommended Resources

### Online Courses
1. **Advanced JavaScript**: Deep dive into modern JS features
2. **System Design**: Scalable architecture patterns
3. **Cloud Computing**: AWS, Azure, or GCP certification
4. **DevOps**: CI/CD and infrastructure as code

### Books
1. "Clean Code" by Robert C. Martin
2. "Designing Data-Intensive Applications" by Martin Kleppmann
3. "The Pragmatic Programmer" by Andrew Hunt and David Thomas
4. "System Design Interview" by Alex Xu

### Practice Platforms
1. **LeetCode**: Algorithm and data structure practice
2. **HackerRank**: Programming challenges
3. **GitHub**: Open source contributions
4. **Personal Projects**: Build portfolio-worthy applications

## Success Metrics

### Technical Metrics
- **Code Quality**: Maintain 90%+ test coverage
- **Performance**: Achieve sub-100ms response times
- **Security**: Zero critical vulnerabilities
- **Documentation**: 100% API documentation coverage

### Career Metrics
- **Skill Validation**: Obtain relevant certifications
- **Portfolio**: Build 5+ significant projects
- **Networking**: Attend 10+ industry events
- **Leadership**: Lead 2+ technical initiatives

## Weekly Schedule Template

### Monday: Learning Day
- 2 hours: Online course or reading
- 1 hour: Practice exercises
- 1 hour: Review and reflection

### Tuesday-Thursday: Project Work
- 3 hours: Active project development
- 1 hour: Code review and optimization
- 1 hour: Documentation and testing

### Friday: Review and Planning
- 2 hours: Weekly progress review
- 2 hours: Next week planning
- 1 hour: Skill assessment and adjustment

### Weekend: Deep Work
- 4 hours: Complex problem solving
- 2 hours: Research and exploration
- 2 hours: Portfolio updates

## Tracking Progress

### Weekly Check-ins
- Review completed tasks
- Assess skill improvements
- Adjust learning priorities
- Plan next week's focus

### Monthly Reviews
- Evaluate overall progress
- Identify new learning opportunities
- Update career goals
- Celebrate achievements

### Quarterly Assessments
- Comprehensive skill evaluation
- Career goal alignment check
- Learning path adjustment
- Long-term planning

## Conclusion

This personalized learning roadmap provides a structured approach to advancing your technical skills and career. Remember that learning is a continuous journey, and flexibility is key to adapting to new technologies and opportunities.

Stay committed to your growth, embrace challenges as learning opportunities, and maintain a balance between technical skills and soft skills development.

---

*Success is not final, failure is not fatal: it is the courage to continue that counts.* - Winston Churchill
    `;

    return {
      id: Date.now().toString(),
      type: 'learning-path',
      title,
      content,
      summary: 'A comprehensive learning roadmap personalized to your current skills and career goals.',
      tags: ['learning', 'career-development', 'skill-building', 'roadmap'],
      estimatedReadTime: 15,
      generatedAt: new Date()
    };
  };

  const generateTechArticle = (project: Project): GeneratedContent => {
    const title = `The Future of ${project.technologies[0]}: Trends and Innovations in 2024`;
    const content = `
# The Future of ${project.technologies[0]}: Trends and Innovations in 2024

## Introduction

As we navigate through 2024, the technology landscape continues to evolve at an unprecedented pace. ${project.technologies[0]} has emerged as a cornerstone technology, driving innovation across industries and reshaping how we approach software development.

In this comprehensive analysis, I'll explore the current state of ${project.technologies[0]}, emerging trends, and what the future holds for developers and organizations leveraging this powerful technology.

## Current State of ${project.technologies[0]}

### Market Adoption
${project.technologies[0]} has seen remarkable adoption rates, with over 80% of Fortune 500 companies integrating it into their technology stack. The technology has proven its value across various use cases, from web applications to enterprise solutions.

### Key Strengths
- **Performance**: Superior performance compared to traditional alternatives
- **Scalability**: Built-in scalability features for growing applications
- **Developer Experience**: Excellent tooling and community support
- **Ecosystem**: Rich ecosystem of libraries and frameworks

## Emerging Trends

### 1. AI/ML Integration
The integration of artificial intelligence and machine learning with ${project.technologies[0]} is revolutionizing how we build intelligent applications.

**Key Developments:**
- Automated code generation and optimization
- Intelligent debugging and error prediction
- AI-powered testing and quality assurance
- Natural language processing for code documentation

**Impact on Development:**
- Reduced development time by 40-60%
- Improved code quality and maintainability
- Enhanced developer productivity
- New opportunities for innovation

### 2. Edge Computing
Edge computing is becoming increasingly important, and ${project.technologies[0]} is at the forefront of this revolution.

**Applications:**
- Real-time data processing
- IoT device management
- Low-latency applications
- Distributed computing systems

**Benefits:**
- Reduced latency and improved performance
- Lower bandwidth costs
- Enhanced privacy and security
- Better user experience

### 3. Microservices Architecture
The shift toward microservices architecture is accelerating, with ${project.technologies[0]} providing excellent support for this paradigm.

**Advantages:**
- Improved scalability and maintainability
- Better fault isolation
- Technology diversity within systems
- Faster deployment cycles

**Implementation Strategies:**
- Service mesh implementation
- API gateway patterns
- Event-driven architecture
- Container orchestration

### 4. Serverless Computing
Serverless computing is gaining momentum, and ${project.technologies[0]} is well-positioned to leverage this trend.

**Benefits:**
- Reduced operational overhead
- Automatic scaling
- Pay-per-use pricing
- Faster time to market

**Use Cases:**
- API development
- Event processing
- Data transformation
- Real-time applications

## Future Predictions

### 2024-2025: Enhanced AI Integration
- **AI-powered development tools** will become standard
- **Automated testing and deployment** will increase efficiency
- **Intelligent code review** will improve quality
- **Predictive maintenance** will reduce downtime

### 2025-2026: Quantum Computing Integration
- **Quantum algorithms** will enhance performance
- **Quantum-safe cryptography** will become essential
- **Hybrid classical-quantum** applications will emerge
- **New programming paradigms** will develop

### 2026-2027: Autonomous Systems
- **Self-healing applications** will become common
- **Autonomous deployment** will reduce human intervention
- **Intelligent resource management** will optimize costs
- **Predictive scaling** will improve performance

## Industry Impact

### Healthcare
- **Telemedicine platforms** built with ${project.technologies[0]}
- **Medical device integration** for real-time monitoring
- **AI-powered diagnosis** systems
- **Patient data management** and security

### Finance
- **Blockchain integration** for secure transactions
- **Real-time trading** platforms
- **Fraud detection** systems
- **Regulatory compliance** automation

### Education
- **Personalized learning** platforms
- **Virtual reality** educational experiences
- **AI-powered tutoring** systems
- **Collaborative learning** environments

### Manufacturing
- **IoT device management** and monitoring
- **Predictive maintenance** systems
- **Supply chain optimization**
- **Quality control** automation

## Skills Development

### Essential Skills for 2024
1. **${project.technologies[0]} Fundamentals**: Deep understanding of core concepts
2. **AI/ML Basics**: Understanding of machine learning principles
3. **Cloud Computing**: Proficiency with major cloud platforms
4. **DevOps Practices**: CI/CD, containerization, and orchestration
5. **Security**: Application security and best practices

### Advanced Skills
1. **System Design**: Scalable architecture patterns
2. **Performance Optimization**: Profiling and optimization techniques
3. **Data Engineering**: Big data processing and analytics
4. **Mobile Development**: Cross-platform mobile applications
5. **Blockchain**: Distributed ledger technology

## Learning Resources

### Online Courses
- Advanced ${project.technologies[0]} courses on major platforms
- AI/ML integration workshops
- Cloud computing certifications
- Security-focused training programs

### Books and Documentation
- Official ${project.technologies[0]} documentation
- Industry best practices guides
- Architecture pattern books
- Security and performance optimization resources

### Community and Networking
- Local meetups and conferences
- Online forums and discussion groups
- Open source contributions
- Technical blog writing

## Conclusion

The future of ${project.technologies[0]} is incredibly promising, with numerous opportunities for innovation and growth. As we move forward, staying current with emerging trends and continuously developing our skills will be crucial for success.

The key to thriving in this evolving landscape is to:
- **Embrace continuous learning** and skill development
- **Stay current with industry trends** and best practices
- **Build a strong foundation** in core concepts
- **Experiment with new technologies** and approaches
- **Contribute to the community** and share knowledge

The journey ahead is exciting, and ${project.technologies[0]} will continue to play a pivotal role in shaping the future of software development.

---

*The best way to predict the future is to invent it.* - Alan Kay

---

*What trends are you most excited about in ${project.technologies[0]}? Share your thoughts and experiences in the comments below!*
    `;

    return {
      id: Date.now().toString(),
      type: 'tech-article',
      title,
      content,
      summary: `An in-depth analysis of ${project.technologies[0]} trends and future innovations in 2024.`,
      tags: [...project.technologies, 'trends', 'innovation', 'future-tech'],
      estimatedReadTime: 10,
      generatedAt: new Date()
    };
  };

  const getTechDescription = (tech: string): string => {
    const descriptions: Record<string, string> = {
      'React': 'building interactive user interfaces',
      'TypeScript': 'type-safe JavaScript development',
      'Node.js': 'server-side JavaScript runtime',
      'Python': 'data processing and backend development',
      'Docker': 'containerization and deployment',
      'AWS': 'cloud infrastructure and services',
      'MongoDB': 'NoSQL database management',
      'PostgreSQL': 'relational database operations',
      'Next.js': 'full-stack React framework',
      'Tailwind CSS': 'utility-first CSS framework'
    };
    return descriptions[tech] || 'application development';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadContent = (content: GeneratedContent) => {
    const element = document.createElement('a');
    const file = new Blob([content.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            AI Content Intelligence Engine
          </h2>
          <p className="text-indigo-200 text-lg">
            Generate professional blog posts, case studies, and learning content with AI-powered insights
          </p>
        </div>

        {!isGenerating && !generatedContent && (
          <div className="space-y-8">
            {/* Content Type Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Choose Content Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedType === type.id
                          ? 'border-white bg-white/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold">{type.name}</h4>
                      </div>
                      <p className="text-sm text-indigo-200">{type.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Project Selection */}
            {selectedType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-6">Select Project (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedProject === null
                        ? 'border-white bg-white/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">Generate General Content</h4>
                    <p className="text-sm text-indigo-200">Create content based on your skills and experience</p>
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        selectedProject?.id === project.id
                          ? 'border-white bg-white/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <h4 className="font-semibold mb-2">{project.name}</h4>
                      <p className="text-sm text-indigo-200 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-white/10 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            {selectedType && (
              <motion.button
                onClick={generateContent}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-6 h-6 inline mr-2" />
                Generate AI Content
              </motion.button>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="text-center space-y-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
            <h3 className="text-xl font-semibold">
              {currentStep === 0 && 'Analyzing project data...'}
              {currentStep === 1 && 'Researching market trends...'}
              {currentStep === 2 && 'Generating content structure...'}
              {currentStep === 3 && 'Writing engaging content...'}
              {currentStep === 4 && 'Optimizing for SEO...'}
              {currentStep === 5 && 'Finalizing and formatting...'}
            </h3>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Content Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{generatedContent.title}</h3>
                    <p className="text-indigo-200 mb-4">{generatedContent.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-indigo-300">
                      {generatedContent.estimatedReadTime} min read
                    </p>
                    <p className="text-xs text-indigo-400">
                      {generatedContent.generatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(generatedContent.content)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Content
                  </button>
                  <button
                    onClick={() => downloadContent(generatedContent)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedContent(null);
                      setSelectedType('');
                      setSelectedProject(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Generate New
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Content Preview</h4>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
                    {generatedContent.content}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIContentGenerator; 