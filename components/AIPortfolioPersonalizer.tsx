'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Target, TrendingUp, Eye, MousePointer, Clock, BarChart3 } from 'lucide-react';

interface Visitor {
  id: string;
  type: 'recruiter' | 'developer' | 'designer' | 'client' | 'general';
  interests: string[];
  behavior: {
    timeOnSite: number;
    pagesVisited: string[];
    interactions: string[];
    scrollDepth: number;
  };
  sessionStart: Date;
}

interface PersonalizedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  targetAudience: string[];
  priority: number;
  performance: {
    views: number;
    engagement: number;
    conversion: number;
  };
}

interface AIPortfolioPersonalizerProps {
  onPersonalizationUpdate: (content: PersonalizedContent[]) => void;
}

const AIPortfolioPersonalizer: React.FC<AIPortfolioPersonalizerProps> = ({ onPersonalizationUpdate }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [abTestResults, setAbTestResults] = useState<any>(null);
  const sessionRef = useRef<NodeJS.Timeout | null>(null);
  const scrollDepthRef = useRef<number>(0);

  const audienceTypes = [
    {
      id: 'recruiter',
      name: 'Recruiter',
      icon: Users,
      description: 'HR professionals and talent acquisition specialists',
      interests: ['experience', 'skills', 'achievements', 'culture-fit']
    },
    {
      id: 'developer',
      name: 'Developer',
      icon: Brain,
      description: 'Fellow developers and technical professionals',
      interests: ['technical-skills', 'projects', 'code-quality', 'architecture']
    },
    {
      id: 'designer',
      name: 'Designer',
      icon: Eye,
      description: 'UI/UX designers and creative professionals',
      interests: ['design-thinking', 'user-experience', 'visual-design', 'creativity']
    },
    {
      id: 'client',
      name: 'Client',
      icon: Target,
      description: 'Potential clients and business partners',
      interests: ['business-value', 'solutions', 'results', 'reliability']
    },
    {
      id: 'general',
      name: 'General',
      icon: TrendingUp,
      description: 'General visitors and casual browsers',
      interests: ['overview', 'highlights', 'story', 'contact']
    }
  ];

  useEffect(() => {
    if (isActive) {
      startVisitorTracking();
    }
    return () => {
      if (sessionRef.current) {
        clearInterval(sessionRef.current);
      }
    };
  }, [isActive]);

  const startVisitorTracking = () => {
    // Simulate visitor detection and tracking
    const visitor: Visitor = {
      id: Date.now().toString(),
      type: detectVisitorType(),
      interests: detectInterests(),
      behavior: {
        timeOnSite: 0,
        pagesVisited: [],
        interactions: [],
        scrollDepth: 0
      },
      sessionStart: new Date()
    };

    setCurrentVisitor(visitor);

    // Track session time
    sessionRef.current = setInterval(() => {
      setCurrentVisitor(prev => {
        if (prev) {
          return {
            ...prev,
            behavior: {
              ...prev.behavior,
              timeOnSite: prev.behavior.timeOnSite + 1
            }
          };
        }
        return prev;
      });
    }, 1000);

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  };

  const detectVisitorType = (): Visitor['type'] => {
    // Simulate AI-powered visitor type detection
    const types: Visitor['type'][] = ['recruiter', 'developer', 'designer', 'client', 'general'];
    const weights = [0.2, 0.3, 0.15, 0.2, 0.15]; // Probability weights
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return types[i];
      }
    }
    return 'general';
  };

  const detectInterests = (): string[] => {
    const allInterests = [
      'react', 'typescript', 'nodejs', 'python', 'ai', 'ml', 'cloud', 'devops',
      'design', 'ux', 'business', 'startup', 'open-source', 'performance', 'security'
    ];
    
    const numInterests = Math.floor(Math.random() * 5) + 3;
    const shuffled = allInterests.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numInterests);
  };

  const generatePersonalizedContent = async () => {
    if (!currentVisitor) return;

    setIsAnalyzing(true);

    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const content = await performAIPersonalization(currentVisitor);
      setPersonalizedContent(content);
      onPersonalizationUpdate(content);

      // Generate analytics
      const analytics = await generateAnalytics(currentVisitor, content);
      setAnalytics(analytics);

      // Run A/B testing
      const abResults = await runABTesting(content);
      setAbTestResults(abResults);

    } catch (error) {
      console.error('Personalization failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAIPersonalization = async (visitor: Visitor): Promise<PersonalizedContent[]> => {
    const contentTemplates = {
      recruiter: [
        {
          type: 'hero',
          title: 'Experienced Full-Stack Developer',
          content: 'Passionate developer with 5+ years of experience building scalable web applications. Proven track record of delivering high-quality solutions that drive business growth.',
          priority: 1
        },
        {
          type: 'skills',
          title: 'Core Competencies',
          content: 'Expert in React, TypeScript, Node.js, and cloud technologies. Strong focus on clean code, testing, and performance optimization.',
          priority: 2
        },
        {
          type: 'achievements',
          title: 'Key Achievements',
          content: 'Led development of applications serving 100K+ users, improved performance by 60%, and mentored 10+ junior developers.',
          priority: 3
        }
      ],
      developer: [
        {
          type: 'hero',
          title: 'Full-Stack Engineer & Open Source Contributor',
          content: 'Building robust, scalable applications with modern technologies. Passionate about clean architecture, performance, and developer experience.',
          priority: 1
        },
        {
          type: 'projects',
          title: 'Featured Projects',
          content: 'Check out my latest projects showcasing advanced React patterns, microservices architecture, and innovative solutions.',
          priority: 2
        },
        {
          type: 'tech-stack',
          title: 'Technology Stack',
          content: 'React, TypeScript, Node.js, Python, Docker, AWS, PostgreSQL, Redis, and more. Always exploring new technologies.',
          priority: 3
        }
      ],
      designer: [
        {
          type: 'hero',
          title: 'Developer with Design Sensibility',
          content: 'Creating beautiful, functional applications that prioritize user experience. Bridging the gap between development and design.',
          priority: 1
        },
        {
          type: 'design-thinking',
          title: 'Design-First Approach',
          content: 'Every project starts with understanding user needs and creating intuitive, accessible interfaces that delight users.',
          priority: 2
        },
        {
          type: 'portfolio',
          title: 'Visual Portfolio',
          content: 'Explore my projects to see how I combine technical excellence with thoughtful design and user experience.',
          priority: 3
        }
      ],
      client: [
        {
          type: 'hero',
          title: 'Solutions Architect & Technical Consultant',
          content: 'Transforming business challenges into innovative technical solutions. Delivering measurable results and exceptional value.',
          priority: 1
        },
        {
          type: 'solutions',
          title: 'Business Solutions',
          content: 'Specialized in building custom applications that streamline operations, improve efficiency, and drive growth.',
          priority: 2
        },
        {
          type: 'results',
          title: 'Proven Results',
          content: 'Successfully delivered projects for clients across industries, achieving 40% average efficiency improvements.',
          priority: 3
        }
      ],
      general: [
        {
          type: 'hero',
          title: 'Full-Stack Developer & Problem Solver',
          content: 'Passionate about creating innovative solutions that make a difference. Combining technical expertise with creative thinking.',
          priority: 1
        },
        {
          type: 'story',
          title: 'My Journey',
          content: 'From learning to code to building applications that impact thousands of users. Always learning, always growing.',
          priority: 2
        },
        {
          type: 'contact',
          title: 'Let\'s Connect',
          content: 'Interested in collaboration, opportunities, or just want to chat about technology? I\'d love to hear from you.',
          priority: 3
        }
      ]
    };

    const templates = contentTemplates[visitor.type] || contentTemplates.general;
    
    return templates.map((template, index) => ({
      id: `${visitor.type}-${index}`,
      type: template.type,
      title: template.title,
      content: template.content,
      targetAudience: [visitor.type],
      priority: template.priority,
      performance: {
        views: Math.floor(Math.random() * 100) + 50,
        engagement: Math.floor(Math.random() * 30) + 20,
        conversion: Math.floor(Math.random() * 10) + 5
      }
    }));
  };

  const generateAnalytics = async (visitor: Visitor, content: PersonalizedContent[]) => {
    return {
      visitorType: visitor.type,
      sessionDuration: visitor.behavior.timeOnSite,
      contentEngagement: content.reduce((sum, c) => sum + c.performance.engagement, 0) / content.length,
      scrollDepth: scrollDepthRef.current,
      pagesVisited: visitor.behavior.pagesVisited.length,
      interactions: visitor.behavior.interactions.length,
      personalizedContentCount: content.length,
      averagePerformance: {
        views: content.reduce((sum, c) => sum + c.performance.views, 0) / content.length,
        engagement: content.reduce((sum, c) => sum + c.performance.engagement, 0) / content.length,
        conversion: content.reduce((sum, c) => sum + c.performance.conversion, 0) / content.length
      }
    };
  };

  const runABTesting = async (content: PersonalizedContent[]) => {
    // Simulate A/B testing with AI optimization
    const variants = content.map(c => ({
      ...c,
      variant: Math.random() > 0.5 ? 'A' : 'B',
      performance: {
        ...c.performance,
        views: c.performance.views + Math.floor(Math.random() * 50),
        engagement: c.performance.engagement + Math.floor(Math.random() * 10),
        conversion: c.performance.conversion + Math.floor(Math.random() * 5)
      }
    }));

    const results = variants.map(variant => ({
      id: variant.id,
      variant: variant.variant,
      performance: variant.performance,
      improvement: {
        views: ((variant.performance.views - content.find(c => c.id === variant.id)!.performance.views) / content.find(c => c.id === variant.id)!.performance.views) * 100,
        engagement: ((variant.performance.engagement - content.find(c => c.id === variant.id)!.performance.engagement) / content.find(c => c.id === variant.id)!.performance.engagement) * 100,
        conversion: ((variant.performance.conversion - content.find(c => c.id === variant.id)!.performance.conversion) / content.find(c => c.id === variant.id)!.performance.conversion) * 100
      }
    }));

    return {
      variants: results,
      winner: results.reduce((best, current) => 
        current.performance.engagement > best.performance.engagement ? current : best
      ),
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
    };
  };

  const trackInteraction = (interaction: string) => {
    setCurrentVisitor(prev => {
      if (prev) {
        return {
          ...prev,
          behavior: {
            ...prev.behavior,
            interactions: [...prev.behavior.interactions, interaction]
          }
        };
      }
      return prev;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            AI Portfolio Personalization Engine
          </h2>
          <p className="text-cyan-200 text-lg">
            Revolutionary AI system that adapts your portfolio content based on visitor behavior and preferences
          </p>
        </div>

        {!isActive && (
          <motion.button
            onClick={() => setIsActive(true)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Brain className="w-6 h-6 inline mr-2" />
            Activate AI Personalization
          </motion.button>
        )}

        {isActive && (
          <div className="space-y-8">
            {/* Visitor Detection */}
            {currentVisitor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Visitor Intelligence
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-3">Detected Visitor Type</h4>
                    <div className="flex items-center gap-3 mb-4">
                      {audienceTypes.find(type => type.id === currentVisitor.type)?.icon && 
                        React.createElement(audienceTypes.find(type => type.id === currentVisitor.type)!.icon, { className: "w-8 h-8" })
                      }
                      <div>
                        <p className="font-semibold text-lg">
                          {audienceTypes.find(type => type.id === currentVisitor.type)?.name}
                        </p>
                        <p className="text-sm text-cyan-300">
                          {audienceTypes.find(type => type.id === currentVisitor.type)?.description}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-cyan-200 mb-2">Detected Interests</h5>
                      <div className="flex flex-wrap gap-2">
                        {currentVisitor.interests.map((interest) => (
                          <span key={interest} className="px-3 py-1 bg-cyan-600/30 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-3">Real-time Behavior</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Session Duration:</span>
                        <span className="font-semibold">{currentVisitor.behavior.timeOnSite}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Scroll Depth:</span>
                        <span className="font-semibold">{Math.round(scrollDepthRef.current)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Interactions:</span>
                        <span className="font-semibold">{currentVisitor.behavior.interactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pages Visited:</span>
                        <span className="font-semibold">{currentVisitor.behavior.pagesVisited.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generatePersonalizedContent}
                  disabled={isAnalyzing}
                  className="mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing & Personalizing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Generate Personalized Content
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Personalized Content */}
            <AnimatePresence>
              {personalizedContent.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI-Generated Personalized Content
                  </h3>
                  
                  <div className="space-y-4">
                    {personalizedContent.map((content) => (
                      <div key={content.id} className="border border-white/20 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{content.title}</h4>
                            <p className="text-cyan-200 text-sm">{content.content}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 bg-cyan-600/30 rounded text-xs">
                              Priority {content.priority}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {content.performance.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MousePointer className="w-4 h-4" />
                              {content.performance.engagement}%
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {content.performance.conversion}%
                            </span>
                          </div>
                          <span className="text-cyan-300">
                            Target: {content.targetAudience.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analytics Dashboard */}
            <AnimatePresence>
              {analytics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Real-time Analytics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">
                        {analytics.sessionDuration}s
                      </div>
                      <p className="text-sm text-cyan-200">Session Duration</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {Math.round(analytics.contentEngagement)}%
                      </div>
                      <p className="text-sm text-cyan-200">Content Engagement</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-400 mb-2">
                        {Math.round(analytics.scrollDepth)}%
                      </div>
                      <p className="text-sm text-cyan-200">Scroll Depth</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* A/B Testing Results */}
            <AnimatePresence>
              {abTestResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    A/B Testing Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2">Winning Variant</h4>
                      <p className="text-sm">
                        Variant {abTestResults.winner.variant} showed {abTestResults.winner.performance.engagement}% engagement
                        with {abTestResults.confidence}% confidence level
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {abTestResults.variants.map((variant) => (
                        <div key={variant.id} className="border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold">Variant {variant.variant}</h5>
                            <span className={`px-2 py-1 rounded text-xs ${
                              variant.variant === abTestResults.winner.variant 
                                ? 'bg-green-600/30 text-green-400' 
                                : 'bg-gray-600/30 text-gray-400'
                            }`}>
                              {variant.variant === abTestResults.winner.variant ? 'Winner' : 'Runner-up'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Engagement:</span>
                              <span className="font-semibold">{variant.performance.engagement}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Improvement:</span>
                              <span className={`font-semibold ${
                                variant.improvement.engagement > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {variant.improvement.engagement > 0 ? '+' : ''}{Math.round(variant.improvement.engagement)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPortfolioPersonalizer; 