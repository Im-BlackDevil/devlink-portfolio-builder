'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  marketDemand: number;
  x: number;
  y: number;
  z: number;
  connections: string[];
}

interface SkillVisualization3DProps {
  skills: Skill[];
  onSkillSelect: (skill: Skill) => void;
}

const SkillNode: React.FC<{ skill: Skill; isSelected: boolean; onClick: () => void }> = ({ 
  skill, 
  isSelected, 
  onClick 
}) => {
  const [hovered, setHovered] = useState(false);

  const size = (skill.proficiency / 100) * 60 + 20; // 20-80px
  const color = skill.marketDemand > 80 ? '#10b981' : skill.marketDemand > 60 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        zIndex: isSelected ? 10 : 1
      }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          style={{
            background: `radial-gradient(circle, ${color}40, ${color}20)`,
            boxShadow: `0 0 ${size/2}px ${color}60`
          }}
          animate={{
            scale: hovered ? 1.2 : 1,
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            backgroundColor: isSelected ? '#3b82f6' : color,
            boxShadow: hovered ? `0 0 ${size/3}px ${color}` : 'none'
          }}
          animate={{
            scale: hovered ? 1.1 : 1,
            rotate: [360, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {isSelected && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {skill.name}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SkillConnection: React.FC<{ from: Skill; to: Skill }> = ({ from, to }) => {
  const distance = Math.sqrt(
    Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
  );
  
  if (distance > 30) return null; // Only show connections for nearby skills

  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  const length = distance;

  return (
    <motion.div
      className="absolute origin-left"
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        height: '2px',
        transform: `rotate(${angle}deg)`,
        background: 'linear-gradient(90deg, #6366f1, transparent)',
        zIndex: 0
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  );
};

const SkillVisualization3D: React.FC<SkillVisualization3DProps> = ({ skills, onSkillSelect }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    onSkillSelect(skill);
  };

  const generateSkillPositions = (skills: Skill[]): Skill[] => {
    return skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 30 + (skill.marketDemand / 100) * 20;
      
      return {
        ...skill,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        connections: skills
          .filter(s => s.category === skill.category && s.id !== skill.id)
          .slice(0, 2)
          .map(s => s.id)
      };
    });
  };

  const positionedSkills = generateSkillPositions(skills);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Initializing 3D Skill Network</h3>
          <p className="text-purple-200">Loading AI-powered visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            3D Skill Intelligence Network
          </h2>
          <p className="text-purple-200 text-lg">
            Interactive 3D visualization of your skills with AI-powered insights and market analysis
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <div className="h-96 bg-black/20 rounded-xl overflow-hidden relative">
              {/* Background grid effect */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }} />
              </div>
              {/* Skill nodes */}
              <div className="relative w-full h-full">
                {positionedSkills.map((skill) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkill?.id === skill.id}
                    onClick={() => handleSkillSelect(skill)}
                  />
                ))}
                {/* Skill connections */}
                {positionedSkills.map((skill) =>
                  skill.connections.map((connectionId) => {
                    const connectedSkill = positionedSkills.find(s => s.id === connectionId);
                    if (connectedSkill) {
                      return (
                        <SkillConnection
                          key={`${skill.id}-${connectionId}`}
                          from={skill}
                          to={connectedSkill}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-purple-300">
              <p>💡 Click on skill nodes to see detailed insights</p>
              <p>🔄 Hover to see connections • Interactive 3D-like experience</p>
            </div>
          </div>
          {/* Skill Details Panel */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Skill Intelligence
              </h3>
              {selectedSkill ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">{selectedSkill.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Proficiency:</span>
                        <span className="font-semibold text-green-400">{selectedSkill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedSkill.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Market Demand:</span>
                      <span className="font-semibold text-blue-400">{Math.round(selectedSkill.marketDemand)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSkill.marketDemand}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-purple-200">Category:</span>
                    <p className="font-semibold">{selectedSkill.category}</p>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <h5 className="font-semibold text-purple-200 mb-2">AI Insights:</h5>
                    <div className="space-y-2 text-sm">
                      {selectedSkill.proficiency > 80 && (
                        <p className="text-green-400">🎯 Expert level - Consider mentoring others</p>
                      )}
                      {selectedSkill.marketDemand > 80 && (
                        <p className="text-blue-400">📈 High demand - Great career opportunity</p>
                      )}
                      {selectedSkill.proficiency < 50 && selectedSkill.marketDemand > 70 && (
                        <p className="text-yellow-400">⚠️ Skill gap detected - Focus on improvement</p>
                      )}
                      {selectedSkill.connections.length > 0 && (
                        <p className="text-purple-400">🔗 Connected to {selectedSkill.connections.length} related skills</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-purple-300">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a skill node to view detailed insights</p>
                </div>
              )}
            </div>
            {/* Network Statistics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Network Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Skills:</span>
                  <span className="font-semibold">{skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Categories:</span>
                  <span className="font-semibold">{new Set(skills.map(s => s.category)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Proficiency:</span>
                  <span className="font-semibold text-green-400">
                    {Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Market Demand:</span>
                  <span className="font-semibold text-blue-400">
                    {Math.round(skills.reduce((sum, s) => sum + s.marketDemand, 0) / skills.length)}%
                  </span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>High Market Demand (&gt;80%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Medium Market Demand (60-80%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Low Market Demand (&lt;60%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Selected Skill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillVisualization3D; 