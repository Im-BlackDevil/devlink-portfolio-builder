'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Target, BookOpen, Zap } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number;
  category: string;
  marketDemand: number;
  learningPath: string[];
  aiRecommendation: string;
}

interface AISkillAnalyzerProps {
  currentSkills: Skill[];
  onAnalysisComplete: (analysis: any) => void;
}

const AISkillAnalyzer: React.FC<AISkillAnalyzerProps> = ({ currentSkills, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    { name: 'Loading AI Model', icon: Brain },
    { name: 'Analyzing Skills', icon: TrendingUp },
    { name: 'Predicting Market Trends', icon: Target },
    { name: 'Generating Recommendations', icon: BookOpen },
    { name: 'Creating Learning Path', icon: Zap }
  ];

  const analyzeSkills = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Simulate AI analysis steps
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Perform AI analysis
      const enhancedSkills = await performAIAnalysis(currentSkills);
      const marketInsights = await generateMarketInsights(enhancedSkills);
      const learningPath = await generateLearningPath(enhancedSkills);
      const careerPredictions = await predictCareerPath(enhancedSkills);

      const analysisResult = {
        enhancedSkills,
        marketInsights,
        learningPath,
        careerPredictions,
        timestamp: new Date().toISOString()
      };

      setAnalysis(analysisResult);
      onAnalysisComplete(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAIAnalysis = async (skills: Skill[]): Promise<Skill[]> => {
    // Simulate AI processing with advanced algorithms
    return skills.map(skill => {
      // Calculate market demand based on skill trends
      const marketDemand = calculateMarketDemand(skill.name, skill.proficiency);
      const aiRecommendation = generateRecommendation(skill, marketDemand);
      
      return {
        ...skill,
        marketDemand,
        aiRecommendation
      };
    });
  };

  const calculateMarketDemand = (skillName: string, proficiency: number): number => {
    // AI-powered market demand calculation
    const skillTrends: Record<string, number> = {
      'React': 95,
      'TypeScript': 92,
      'Node.js': 88,
      'Python': 90,
      'Docker': 85,
      'AWS': 93,
      'MongoDB': 78,
      'GraphQL': 82,
      'Next.js': 89,
      'Tailwind CSS': 87
    };

    const baseDemand = skillTrends[skillName] || 75;
    const proficiencyBonus = (proficiency / 100) * 10;
    const marketVariation = Math.random() * 10 - 5; // ±5% variation

    return Math.max(0, Math.min(100, baseDemand + proficiencyBonus + marketVariation));
  };

  const generateMarketInsights = async (skills: Skill[]) => {
    const insights = {
      topSkills: skills.sort((a, b) => b.marketDemand - a.marketDemand).slice(0, 5),
      emergingSkills: skills.filter(skill => skill.marketDemand > 80),
      skillGaps: skills.filter(skill => skill.proficiency < 50 && skill.marketDemand > 70),
      marketTrends: [
        'AI/ML skills are in high demand',
        'Full-stack development is trending',
        'Cloud computing skills are essential',
        'Cybersecurity expertise is growing',
        'DevOps practices are becoming standard'
      ]
    };

    return insights;
  };

  const generateLearningPath = async (skills: Skill[]) => {
    const skillGaps = skills.filter(skill => skill.proficiency < 50 && skill.marketDemand > 70);
    
    return skillGaps.map(skill => ({
      skill: skill.name,
      currentLevel: skill.proficiency,
      targetLevel: 80,
      resources: [
        `Complete ${skill.name} fundamentals course`,
        `Build 3 projects using ${skill.name}`,
        `Contribute to open-source ${skill.name} projects`,
        `Get certified in ${skill.name}`,
        `Practice ${skill.name} daily for 30 days`
      ],
      estimatedTime: '3-6 months',
      priority: 'High'
    }));
  };

  const predictCareerPath = async (skills: Skill[]) => {
    const avgProficiency = skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length;
    const avgMarketDemand = skills.reduce((sum, skill) => sum + skill.marketDemand, 0) / skills.length;

    return {
      currentLevel: avgProficiency > 80 ? 'Senior' : avgProficiency > 60 ? 'Mid-level' : 'Junior',
      nextLevel: avgProficiency > 80 ? 'Lead/Architect' : 'Senior',
      timeToNextLevel: avgProficiency > 80 ? '6-12 months' : '1-2 years',
      recommendedRoles: [
        'Full Stack Developer',
        'AI/ML Engineer',
        'DevOps Engineer',
        'Software Architect',
        'Tech Lead'
      ],
      salaryProjection: avgMarketDemand > 80 ? '$120k-$180k' : '$80k-$120k'
    };
  };

  const generateRecommendation = (skill: Skill, marketDemand: number): string => {
    if (marketDemand > 85 && skill.proficiency > 80) {
      return 'Master this skill - you have a competitive advantage in a high-demand market';
    } else if (marketDemand > 80) {
      return 'Focus on mastering this skill - high market demand detected';
    } else if (skill.proficiency < 50 && marketDemand > 70) {
      return 'Critical skill gap - prioritize learning this technology';
    } else if (skill.proficiency > 70) {
      return 'Maintain current level - stable market position';
    } else {
      return 'Consider upskilling - moderate growth potential';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            AI Skill Intelligence Engine
          </h2>
          <p className="text-purple-200 text-lg">
            Revolutionary AI-powered skill analysis with market predictions and personalized learning paths
          </p>
        </div>

        {!isAnalyzing && !analysis && (
          <motion.button
            onClick={analyzeSkills}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Brain className="w-6 h-6 inline mr-2" />
            Launch AI Analysis
          </motion.button>
        )}

        {isAnalyzing && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {analysisSteps[currentStep].name}
              </h3>
              <div className="flex justify-center items-center gap-2">
                {analysisSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`p-2 rounded-full ${
                        index <= currentStep ? 'bg-white text-purple-900' : 'bg-purple-800 text-purple-300'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Market Insights */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Intelligence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">Top Skills in Demand</h4>
                    <div className="space-y-2">
                      {analysis.marketInsights.topSkills.slice(0, 3).map((skill: Skill, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{skill.name}</span>
                          <span className="text-green-400 font-semibold">{Math.round(skill.marketDemand)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">Skill Gaps to Address</h4>
                    <div className="space-y-2">
                      {analysis.marketInsights.skillGaps.slice(0, 3).map((skill: Skill, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{skill.name}</span>
                          <span className="text-red-400 font-semibold">{skill.proficiency}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  AI-Generated Learning Path
                </h3>
                <div className="space-y-4">
                  {analysis.learningPath.slice(0, 3).map((path: any, index: number) => (
                    <div key={index} className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-purple-200">{path.skill}</h4>
                      <p className="text-sm text-purple-300 mb-2">
                        Current: {path.currentLevel}% → Target: {path.targetLevel}%
                      </p>
                      <div className="text-sm text-purple-200">
                        <p className="font-semibold">Next Steps:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {path.resources.slice(0, 2).map((resource: string, idx: number) => (
                            <li key={idx}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Predictions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Career Trajectory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">Current Level</p>
                    <p className="text-2xl font-bold text-white">{analysis.careerPredictions.currentLevel}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">Next Level</p>
                    <p className="text-2xl font-bold text-green-400">{analysis.careerPredictions.nextLevel}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">Time to Next Level</p>
                    <p className="text-2xl font-bold text-blue-400">{analysis.careerPredictions.timeToNextLevel}</p>
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

export default AISkillAnalyzer; 