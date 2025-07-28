export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  slug: string;
  template: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Personal Information
  name?: string;
  professionalTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  
  // Social Links
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  
  // Relations
  about?: About;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export interface About {
  id: string;
  portfolioId: string;
  content: string;
}

export interface Experience {
  id: string;
  portfolioId: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  portfolioId: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  gpa?: number;
  description?: string;
}

export interface Skill {
  id: string;
  portfolioId: string;
  name: string;
  category: string;
  level: number; // 1-5 scale
}

export interface Project {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  github?: string;
  technologies: string[];
  featured: boolean;
}

export interface Certification {
  id: string;
  portfolioId: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  url?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'minimal' | 'creative';
}

export interface PortfolioFormData {
  // Personal Information
  name: string;
  professionalTitle: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  
  // Social Links
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  
  // Template
  template: string;
  
  // Sections
  about?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'html';
  includeSections: string[];
  theme: 'light' | 'dark';
} 