'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, Users, BarChart3, Sparkles, Rocket } from 'lucide-react';
import AISkillAnalyzer from '../../../components/AISkillAnalyzer';
import AIInterviewSimulator from '../../../components/AIInterviewSimulator';
import SkillVisualization3D from '../../../components/SkillVisualization3D';
import AIContentGenerator from '../../../components/AIContentGenerator';
import AIPortfolioPersonalizer from '../../../components/AIPortfolioPersonalizer';

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  marketDemand: number;
}

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

const AIFeaturesDashboard: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('');
  const [skillAnalysis, setSkillAnalysis] = useState<any>(null);
  const [interviewResults, setInterviewResults] = useState<any>(null);
  const [personalizedContent, setPersonalizedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data for demonstration
  const sampleSkills: Skill[] = [
    { id: '1', name: 'React', proficiency: 85, category: 'Frontend', marketDemand: 92 },
    { id: '2', name: 'TypeScript', proficiency: 78, category: 'Frontend', marketDemand: 88 },
    { id: '3', name: 'Node.js', proficiency: 82, category: 'Backend', marketDemand: 85 },
    { id: '4', name: 'Python', proficiency: 70, category: 'Backend', marketDemand: 90 },
    { id: '5', name: 'Docker', proficiency: 65, category: 'DevOps', marketDemand: 87 },
    { id: '6', name: 'AWS', proficiency: 60, category: 'Cloud', marketDemand: 95 },
    { id: '7', name: 'MongoDB', proficiency: 75, category: 'Database', marketDemand: 80 },
    { id: '8', name: 'GraphQL', proficiency: 68, category: 'API', marketDemand: 82 }
  ];

  const sampleProjects: Project[] = [
    {
      id: '1',
      name: 'AI-Powered Portfolio Platform',
      description: 'A revolutionary portfolio platform with AI-driven personalization and analytics',
      technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI', 'TensorFlow'],
      challenges: ['Real-time AI processing', 'Scalable architecture', 'User experience optimization'],
      solutions: ['Implemented edge computing', 'Used microservices architecture', 'Applied UX research principles']
    },
    {
      id: '2',
      name: 'E-commerce Analytics Dashboard',
      description: 'Advanced analytics dashboard for e-commerce businesses with real-time insights',
      technologies: ['React', 'D3.js', 'Python', 'PostgreSQL', 'Redis'],
      challenges: ['Large data processing', 'Real-time updates', 'Performance optimization'],
      solutions: ['Used data streaming', 'Implemented WebSocket connections', 'Applied caching strategies']
    }
  ];

  const aiFeatures = [
    {
      id: 'skill-analyzer',
      name: 'AI Skill Intelligence',
      description: 'Advanced skill analysis with market predictions and learning recommendations',
      icon: Brain,
      color: 'from-purple-600 to-blue-600',
      status: 'active'
    },
    {
      id: 'interview-simulator',
      name: 'AI Interview Simulator',
      description: 'Practice technical interviews with AI-powered feedback and scoring',
      icon: Target,
      color: 'from-emerald-600 to-teal-600',
      status: 'active'
    },
    {
      id: 'skill-visualization',
      name: '3D Skill Network',
      description: 'Interactive 3D visualization of your skills with real-time insights',
      icon: Zap,
      color: 'from-indigo-600 to-purple-600',
      status: 'active'
    },
    {
      id: 'content-generator',
      name: 'AI Content Generator',
      description: 'Generate professional blog posts, case studies, and learning content',
      icon: PenTool,
      color: 'from-pink-600 to-rose-600',
      status: 'active'
    },
    {
      id: 'portfolio-personalizer',
      name: 'AI Portfolio Personalizer',
      description: 'Adaptive portfolio content based on visitor behavior and preferences',
      icon: Users,
      color: 'from-cyan-600 to-blue-600',
      status: 'active'
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkillAnalysis = (analysis: any) => {
    setSkillAnalysis(analysis);
  };

  const handleInterviewComplete = (results: any) => {
    setInterviewResults(results);
  };

  const handleContentGenerated = (content: any) => {
    setPersonalizedContent(prev => [...prev, content]);
  };

  const handlePersonalizationUpdate = (content: any[]) => {
    setPersonalizedContent(content);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Initializing AI Features</h2>
          <p className="text-gray-300">Loading revolutionary AI-powered portfolio tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Brain className="w-12 h-12 inline mr-4 text-purple-400" />
            AI Portfolio Intelligence Suite
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Experience the future of portfolio creation with cutting-edge AI features that analyze, 
            personalize, and optimize your professional presence in real-time.
          </motion.p>
        </div>

        {/* Feature Grid */}
        {!activeFeature && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left border border-white/20 hover:border-white/40 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-green-600/30 text-green-400 rounded-full">
                      {feature.status}
                    </span>
                    <Rocket className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Back Button */}
        {activeFeature && (
          <motion.button
            onClick={() => setActiveFeature('')}
            className="mb-8 flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to AI Features
          </motion.button>
        )}

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          {activeFeature === 'skill-analyzer' && (
            <motion.div
              key="skill-analyzer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AISkillAnalyzer 
                currentSkills={sampleSkills}
                onAnalysisComplete={handleSkillAnalysis}
              />
            </motion.div>
          )}

          {activeFeature === 'interview-simulator' && (
            <motion.div
              key="interview-simulator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIInterviewSimulator 
                userSkills={sampleSkills.map(s => s.name)}
                onSessionComplete={handleInterviewComplete}
              />
            </motion.div>
          )}

          {activeFeature === 'skill-visualization' && (
            <motion.div
              key="skill-visualization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SkillVisualization3D 
                skills={sampleSkills}
                onSkillSelect={(skill) => console.log('Selected skill:', skill)}
              />
            </motion.div>
          )}

          {activeFeature === 'content-generator' && (
            <motion.div
              key="content-generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIContentGenerator 
                userSkills={sampleSkills}
                projects={sampleProjects}
                onContentGenerated={handleContentGenerated}
              />
            </motion.div>
          )}

          {activeFeature === 'portfolio-personalizer' && (
            <motion.div
              key="portfolio-personalizer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIPortfolioPersonalizer 
                onPersonalizationUpdate={handlePersonalizationUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        {(skillAnalysis || interviewResults || personalizedContent.length > 0) && (
          <motion.div
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              AI Analysis Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillAnalysis && (
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Skill Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Career Level:</span>
                      <span className="font-semibold text-purple-400">{skillAnalysis.careerPredictions.currentLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Level:</span>
                      <span className="font-semibold text-green-400">{skillAnalysis.careerPredictions.nextLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to Next:</span>
                      <span className="font-semibold text-blue-400">{skillAnalysis.careerPredictions.timeToNextLevel}</span>
                    </div>
                  </div>
                </div>
              )}

              {interviewResults && (
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-300 mb-3">Interview Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Score:</span>
                      <span className="font-semibold text-emerald-400">{interviewResults.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-semibold">{interviewResults.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold text-blue-400">{Math.round(interviewResults.duration / 60000)}m</span>
                    </div>
                  </div>
                </div>
              )}

              {personalizedContent.length > 0 && (
                <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-3">Generated Content</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Content:</span>
                      <span className="font-semibold text-cyan-400">{personalizedContent.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Types:</span>
                      <span className="font-semibold">{new Set(personalizedContent.map(c => c.type)).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latest:</span>
                      <span className="font-semibold text-blue-400">{personalizedContent[personalizedContent.length - 1]?.type}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">
            Powered by advanced AI algorithms and machine learning models
          </p>
          <p className="text-xs mt-2">
            Real-time analysis • Personalized insights • Continuous optimization
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AIFeaturesDashboard; 