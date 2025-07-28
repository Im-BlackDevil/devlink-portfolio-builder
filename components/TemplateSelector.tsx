'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, EyeIcon, SparklesIcon, PaletteIcon, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  features: string[];
  preview: string;
  animations: string[];
}

const templates: Template[] = [
  {
    id: 'dark-cyber',
    name: 'Cyber Dark',
    description: 'Modern dark theme with neon accents and cyberpunk aesthetics',
    category: 'modern',
    colors: {
      primary: '#00d4ff',
      secondary: '#ff0080',
      background: '#0a0a0a',
      text: '#ffffff'
    },
    features: ['Dark theme', 'Neon accents', 'Gradient animations', '3D effects'],
    preview: 'cyber-dark',
    animations: ['Gradient flow', 'Particle effects', 'Glow animations']
  },
  {
    id: 'light-modern',
    name: 'Clean Modern',
    description: 'Clean and professional light theme with subtle animations',
    category: 'modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      background: '#ffffff',
      text: '#1f2937'
    },
    features: ['Light theme', 'Clean typography', 'Subtle shadows', 'Smooth transitions'],
    preview: 'clean-modern',
    animations: ['Fade in', 'Slide up', 'Hover effects']
  },
  {
    id: 'gradient-vibrant',
    name: 'Vibrant Gradient',
    description: 'Bold gradient theme with vibrant colors and dynamic animations',
    category: 'creative',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    features: ['Gradient backgrounds', 'Vibrant colors', 'Dynamic animations', 'Creative layout'],
    preview: 'vibrant-gradient',
    animations: ['Gradient shift', 'Floating elements', 'Color transitions']
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Minimalist design with elegant typography and subtle interactions',
    category: 'minimal',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      background: '#fafafa',
      text: '#111827'
    },
    features: ['Minimal design', 'Elegant typography', 'Subtle interactions', 'Clean spacing'],
    preview: 'minimal-elegant',
    animations: ['Gentle fade', 'Smooth scroll', 'Micro interactions']
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'Modern glass effect with blur and transparency',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    features: ['Glass effects', 'Blur backgrounds', 'Transparency', 'Modern UI'],
    preview: 'glass-morphism',
    animations: ['Glass morphism', 'Blur effects', 'Transparency animations']
  },
  {
    id: 'retro-wave',
    name: 'Retro Wave',
    description: '80s inspired retro wave aesthetic with neon colors',
    category: 'creative',
    colors: {
      primary: '#ff0080',
      secondary: '#00d4ff',
      background: '#0a0a0a',
      text: '#ffffff'
    },
    features: ['Retro aesthetics', 'Neon colors', 'Grid backgrounds', 'Synthwave style'],
    preview: 'retro-wave',
    animations: ['Grid animations', 'Neon glow', 'Retro effects']
  }
];

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, selectedTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: SparklesIcon },
    { id: 'modern', name: 'Modern', icon: Zap },
    { id: 'classic', name: 'Classic', icon: PaletteIcon },
    { id: 'creative', name: 'Creative', icon: SparklesIcon },
    { id: 'minimal', name: 'Minimal', icon: EyeIcon }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const TemplatePreview: React.FC<{ template: Template }> = ({ template }) => {
    return (
      <div 
        className="relative w-full h-32 rounded-lg overflow-hidden"
        style={{
          background: template.colors.background,
          border: `2px solid ${template.colors.primary}20`
        }}
      >
        {/* Header */}
        <div className="absolute top-2 left-2 right-2 h-4 rounded bg-white/10 backdrop-blur-sm"></div>
        
        {/* Navigation */}
        <div className="absolute top-8 left-2 right-2 flex justify-between items-center">
          <div className="w-16 h-2 rounded" style={{ backgroundColor: template.colors.primary }}></div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: template.colors.secondary }}></div>
            <div className="w-2 h-2 rounded" style={{ backgroundColor: template.colors.primary }}></div>
            <div className="w-2 h-2 rounded" style={{ backgroundColor: template.colors.secondary }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-2 right-2 space-y-1">
          <div className="w-3/4 h-2 rounded" style={{ backgroundColor: template.colors.primary }}></div>
          <div className="w-1/2 h-1 rounded" style={{ backgroundColor: template.colors.secondary }}></div>
        </div>

        {/* Animation overlay */}
        {template.animations.includes('Gradient flow') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8 text-primary-600" />
          Choose Your Portfolio Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our curated collection of stunning portfolio templates. Each template comes with unique animations, 
          color schemes, and layouts designed to showcase your work beautifully.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative group cursor-pointer ${
                selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => onTemplateSelect(template)}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Preview */}
                <div className="p-4">
                  <TemplatePreview template={template} />
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    {selectedTemplate === template.id && (
                      <CheckIcon className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${template.colors.primary}10`,
                          color: template.colors.primary
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 2 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{template.features.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Animations */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>{template.animations.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <AnimatePresence>
                  {hoveredTemplate === template.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <div className="text-white text-center">
                        <EyeIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">Preview Template</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Template Details</h3>
              <button
                onClick={() => onTemplateSelect(templates.find(t => t.id === selectedTemplate)!)}
                className="btn-primary"
              >
                Select Template
              </button>
            </div>
            
            {(() => {
              const template = templates.find(t => t.id === selectedTemplate);
              if (!template) return null;
              
              return (
                <div className="space-y-4">
                  <TemplatePreview template={template} />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {template.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: template.colors.primary }}
                          ></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Animations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.animations.map((animation, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{
                            backgroundColor: `${template.colors.secondary}10`,
                            color: template.colors.secondary
                          }}
                        >
                          {animation}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 