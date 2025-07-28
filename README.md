# DevLink – Developer Portfolio Generator

A modern, full-stack developer portfolio generator with customizable templates, AI-powered content generation, and seamless deployment.

## 🚀 Features

### Core Features
- **Dynamic Forms** - Easy-to-use forms for all portfolio sections with real-time preview
- **Customizable Templates** - Choose from multiple beautiful templates or create your own unique design
- **Export & Deploy** - Download as PDF or deploy with a unique URL for easy sharing
- **AI Integration** - Generate professional content for your portfolio using OpenAI
- **User Authentication** - Secure login system to manage and save your portfolio data
- **Full-Stack Mastery** - Complete full-stack application with modern technologies

### Advanced Features
- **Real-time Preview** - See changes instantly as you edit
- **AI Content Generation** - Generate "About Me" sections and project descriptions
- **Multiple Export Formats** - PDF and HTML export options
- **Responsive Design** - Works perfectly on all devices
- **SEO Optimized** - Built with search engine optimization in mind

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling and validation
- **Heroicons** - Beautiful SVG icons

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM
- **SQLite** - Lightweight database (can be easily switched to PostgreSQL/MySQL)
- **NextAuth.js** - Authentication system
- **bcryptjs** - Password hashing

### AI & Export
- **OpenAI API** - AI content generation
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devlink-portfolio-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OpenAI (Optional - for AI content generation)
   OPENAI_API_KEY="your-openai-api-key-here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. **Register an account** - Create your DevLink account
2. **Create a portfolio** - Start with a template or create from scratch
3. **Fill in your information** - Use the dynamic forms to add your details
4. **Generate AI content** - Use AI to help write your "About Me" and project descriptions
5. **Preview and customize** - See your portfolio in real-time
6. **Export and share** - Download as PDF or get a shareable URL

### Portfolio Sections
- **Personal Information** - Name, title, contact details
- **About Me** - Professional summary with AI generation
- **Experience** - Work history with detailed descriptions
- **Education** - Academic background and achievements
- **Skills** - Technical and soft skills with proficiency levels
- **Projects** - Portfolio of your work with AI generation
- **Certifications** - Professional certifications and achievements
- **Social Links** - GitHub, LinkedIn, Twitter, personal website

## 🔧 Configuration

### Database
The project uses SQLite by default for simplicity. To use PostgreSQL or MySQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql" // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update your `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/devlink"
   ```

### AI Integration
To enable AI content generation:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env.local`:
   ```env
   OPENAI_API_KEY="sk-your-api-key-here"
   ```

### Authentication
The project uses NextAuth.js with credentials provider. To add social logins:

1. Configure providers in `lib/auth.ts`
2. Add provider credentials to `.env.local`

## 📁 Project Structure

```
devlink-portfolio-generator/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── ai/                   # AI generation endpoints
│   │   └── portfolios/           # Portfolio management
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard and portfolio builder
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── providers/                # Context providers
│   ├── PortfolioForm.tsx         # Dynamic portfolio form
│   └── PortfolioPreview.tsx      # Portfolio preview component
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   └── prisma.ts                 # Prisma client
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [OpenAI](https://openai.com/) - AI content generation
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Built with ❤️ for developers who want to showcase their skills beautifully.** 