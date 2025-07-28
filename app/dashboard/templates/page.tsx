'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, SparklesIcon, PaletteIcon, BoltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import TemplateSelector from '@/components/TemplateSelector';

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

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [step, setStep] = useState<'select' | 'customize' | 'build'>('select');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep('customize');
  };

  const handleStartBuilding = () => {
    if (selectedTemplate) {
      // Create a new portfolio with the selected template
      createPortfolioWithTemplate(selectedTemplate);
    }
  };

  const createPortfolioWithTemplate = async (template: Template) => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `My ${template.name} Portfolio`,
          template: template.id,
          templateConfig: {
            colors: template.colors,
            animations: template.animations,
            features: template.features
          },
          isPublic: false
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/portfolio/${data.portfolio.id}`);
      } else {
        console.error('Failed to create portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Portfolio Templates
                </h1>
                <p className="text-sm text-gray-500">
                  Choose your perfect portfolio design
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SparklesIcon className="h-4 w-4" />
                <span>AI-Powered Templates</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step === 'select' ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'select' ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="font-medium">Select Template</span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300"></div>
              
              <div className={`flex items-center space-x-2 ${step === 'customize' ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'customize' ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="font-medium">Customize</span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300"></div>
              
              <div className={`flex items-center space-x-2 ${step === 'build' ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'build' ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="font-medium">Build Portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect}
            />
          </motion.div>
        )}

        {step === 'customize' && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Customize Your {selectedTemplate.name} Portfolio
                </h2>
                <p className="text-lg text-gray-600">
                  Your selected template comes with amazing features and animations
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Template Preview */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Template Preview</h3>
                  <div 
                    className="w-full h-64 rounded-lg overflow-hidden border-2"
                    style={{
                      background: selectedTemplate.colors.background,
                      borderColor: selectedTemplate.colors.primary
                    }}
                  >
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-20 h-3 rounded mb-4" style={{ backgroundColor: selectedTemplate.colors.primary }}></div>
                        <div className="space-y-2">
                          <div className="w-32 h-2 rounded" style={{ backgroundColor: selectedTemplate.colors.secondary }}></div>
                          <div className="w-24 h-2 rounded" style={{ backgroundColor: selectedTemplate.colors.primary }}></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: selectedTemplate.colors.primary }}></div>
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: selectedTemplate.colors.secondary }}></div>
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: selectedTemplate.colors.primary }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Template Features</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Color Scheme</h4>
                      <div className="flex space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: selectedTemplate.colors.primary }}
                          title="Primary Color"
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: selectedTemplate.colors.secondary }}
                          title="Secondary Color"
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm rounded-full"
                            style={{
                              backgroundColor: `${selectedTemplate.colors.primary}10`,
                              color: selectedTemplate.colors.primary
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Animations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.animations.map((animation, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
                          >
                            {animation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      onClick={handleStartBuilding}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <BoltIcon className="w-5 h-5 inline mr-2" />
                      Start Building with {selectedTemplate.name}
                    </button>
                    
                    <button
                      onClick={() => setStep('select')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Choose Different Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 