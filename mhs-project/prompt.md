
Refined Project Prompt: High-Performance Jamstack Landing Page
Project Overview
Objective: Build a production-ready, high-performance landing page using modern Jamstack architecture with complete separation of frontend presentation and content management.

Core Philosophy: Static-first approach with dynamic content capabilities, ensuring maximum performance, security, and developer experience while maintaining cost-effectiveness.

Success Metrics & Requirements
Performance Benchmarks
PageSpeed Insights: 95+ score (mobile & desktop)
Core Web Vitals:
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
Global Load Times: < 1s TTFB via CDN optimization
SEO Excellence
Technical SEO: 100% crawler accessibility with pre-rendered HTML
Metadata Management: Dynamic SEO controls per page via CMS
Schema Markup: Structured data implementation
Accessibility: WCAG 2.1 AA compliance
Image Optimization: WebP/AVIF with responsive sizing and CMS-managed alt text
Security & Reliability
DDoS Protection: Multi-layer defense (Cloudflare + Vercel)
Bot Mitigation: Intelligent traffic filtering
SSL/TLS: A+ rating with HSTS headers
Uptime: 99.9% availability target
Cost Optimization
Zero Operational Costs: Leverage free tiers exclusively
Scalable Architecture: Handle traffic spikes without cost increases
Only Cost: Annual domain registration (~$10-15/year)
Technology Stack
Frontend Framework
Next.js 14+ with App Router

Static Site Generation (SSG) as primary strategy
Incremental Static Regeneration (ISR) for dynamic content
Built-in image optimization and performance features
TypeScript for type safety
Content Management
Sanity.io (Free Tier)

Headless CMS with real-time collaboration
Custom content schemas for landing page components
Built-in asset CDN with automatic optimization
Webhook integration for automated deployments
Hosting & Deployment
Vercel (Hobby Plan)

Global Edge Network deployment
Automatic builds from Git commits
Preview deployments for testing
Built-in analytics and performance monitoring
Security & CDN
Cloudflare (Free Plan)

DNS management and domain configuration
DDoS protection and WAF rules
Bot Fight Mode for malicious traffic filtering
Additional caching layer and performance optimization
Version Control
GitHub (Free)

Source code repository
Automated CI/CD pipeline
Branch protection and code review workflows
Implementation Phases
Phase 1: Foundation Setup (Week 1)
1.
Repository Setup

Initialize Next.js project with TypeScript
Configure ESLint, Prettier, and Husky
Set up GitHub repository with branch protection
2.
CMS Configuration

Set up Sanity.io project and schemas
Configure content models for landing page sections
Set up Sanity Studio for content management
3.
Deployment Pipeline

Connect GitHub to Vercel
Configure build settings and environment variables
Set up preview deployments
Phase 2: Core Development (Week 2)
1.
Landing Page Components

Hero section with dynamic content
Feature sections with CMS integration
Contact forms with validation
Footer with social links
2.
SEO Implementation

Dynamic meta tags from CMS
Open Graph and Twitter Card support
JSON-LD structured data
Sitemap generation
3.
Performance Optimization

Image optimization with Next.js Image component
Code splitting and lazy loading
Font optimization and preloading
Phase 3: Security & Optimization (Week 3)
1.
Cloudflare Integration

DNS configuration and SSL setup
Security rules and bot protection
Caching optimization
2.
Content Workflow

Sanity webhook configuration
Automated revalidation on content changes
Content preview functionality
3.
Testing & Monitoring

Performance testing with Lighthouse
Security scanning and vulnerability assessment
Analytics setup and monitoring
Content Management Workflow
For Content Editors
1.
Access: Log into Sanity Studio via web interface
2.
Edit: Modify content using intuitive visual editor
3.
Preview: Real-time preview of changes
4.
Publish: One-click publishing triggers automatic site rebuild
5.
Live: Changes appear on live site within 2-3 minutes
For Developers
1.
Code Changes: Push to feature branch
2.
Review: Automatic preview deployment for testing
3.
Merge: Approved changes merged to main branch
4.
Deploy: Automatic production deployment
5.
Monitor: Performance and error tracking
Asset Management Strategy
Images
Storage: Sanity Asset CDN
Optimization: Automatic WebP/AVIF conversion
Responsive: Multiple sizes generated automatically
SEO: CMS-managed alt text and captions
Videos
Hosting: YouTube/Vimeo for bandwidth efficiency
Embedding: Lazy-loaded with custom thumbnails
Fallbacks: Poster images for accessibility
Quality Assurance
Automated Testing
Unit Tests: Jest for component testing
E2E Tests: Playwright for user journey testing
Performance: Lighthouse CI in GitHub Actions
Accessibility: axe-core automated testing
Manual Testing
Cross-browser compatibility
Mobile responsiveness
Content management workflow
Performance under load
Deliverables
Technical Deliverables
1.
Live Website: Fully functional landing page
2.
CMS Setup: Configured Sanity Studio
3.
Documentation: Setup and maintenance guides
4.
Performance Report: Lighthouse scores and optimization summary
Handover Package
1.
Content Editor Training: Video tutorials for CMS usage
2.
Developer Documentation: Architecture and deployment guides
3.
Monitoring Setup: Analytics and error tracking configuration
4.
Maintenance Plan: Update schedules and security practices
Success Validation
The project is considered complete when:

All performance benchmarks are met
SEO audit passes with 95+ score
Security scan shows no vulnerabilities
Content workflow is tested and documented
Domain is live with Cloudflare protection
Monitoring and analytics are operational
Risk Mitigation
Technical Risks
Free Tier Limits: Monitor usage and have upgrade plans ready
Third-party Dependencies: Regular security updates and monitoring
Performance Degradation: Continuous monitoring and optimization
Business Risks
Content Management: Comprehensive training and documentation
Scalability: Architecture designed for growth
Vendor Lock-in: Use of standard technologies for easy migration
This refined prompt provides a comprehensive roadmap for building a world-class Jamstack landing page that meets all performance, security, and cost requirements while ensuring long-term maintainability and scalability.