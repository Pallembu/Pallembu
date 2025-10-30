# Project Clarification - MHS Tour Landing Page

## 1. 🌐 Website Languages

**Primary Language:** Indonesian (Bahasa Indonesia)
**Secondary Language:** English

### Implementation Details:
- Multi-language support using Next-Intl
- Indonesian as the default/primary language
- English as secondary language option
- Language switcher in navigation
- All content manageable through Sanity CMS in both languages

---

## 2. 🎯 Target Customers & Market

**Primary Target:** Indonesian Market
**Business Focus:** Tour & Travel Services (only focused for umroh and haji)

### Target Demographics:
- **Geographic:** Indonesia (primary), with English support for international tourists
- **Industry:** Tourism and Travel
- **Customer Type:** 
  - Domestic Indonesian travelers
  - International tourists visiting Indonesia
  - Travel agencies and partners
  - Religious tourism (Mahabbatussholihin - Islamic travel focus)

### Market Positioning:
- Professional tour and travel service provider
- Focus on religious/Islamic tourism
- Corporate and professional image
- Trusted travel partner

---

## 3. 🎨 Color Palette

### Primary Colors
```css
--primary: #39ace7
--primary-light: #9bd4e4
--primary-lighter: #cadeef
--primary-dark: #0784b5
```

### Secondary Colors
```css
--white: #ffffff
--secondary-light: #cadeef
```

### Accent Colors
```css
--accent: #9bd4e4
```

### Usage Guidelines:
- **Primary (#39ace7):** Main brand color, headers, CTAs
- **Primary Light (#9bd4e4):** Hover states, highlights
- **Primary Lighter (#cadeef):** Light text, subtle backgrounds
- **Primary Dark (#0784b5):** Text, strong accents
- **White (#ffffff):** Background, text on dark elements
- **Accent (#9bd4e4):** Button hover states, decorative elements

---

## 4. 📝 Typography

**Primary Font:** Poppins (Google Fonts)

### Font Specifications:
- **Font Family:** Poppins
- **Weights Used:** 300, 400, 500, 600, 700
- **Style:** Corporate/Professional
- **Fallback:** system-ui, sans-serif

### Typography Hierarchy:
- **H1-H6:** Clear heading structure
- **Body Text:** Clean and readable
- **Corporate Feel:** Professional and trustworthy
- **Responsive:** Scales appropriately across devices

---

## 5. ✅ Development Guidelines - DO's and DON'Ts

### ✅ **DO's:**

#### Development Approach
- Follow the 3-phase implementation plan (Foundation → Core → Optimization)
- Use mock/placeholder content initially (all editable via CMS)
- Implement responsive design with mobile-first approach
- Optimize for Core Web Vitals targets
- Use semantic HTML for accessibility
- Implement proper SEO structure
- Follow TypeScript best practices
- Use Tailwind utility classes consistently
- Implement proper error handling
- Create reusable component architecture
- Document components properly
- Test across different browsers and devices

#### Content Management
- Make all content CMS-manageable through Sanity
- Use proper content schemas
- Implement multi-language content structure
- Provide clear CMS training documentation

#### Performance & Quality
- Optimize images and assets
- Implement lazy loading
- Use proper caching strategies
- Follow accessibility standards (WCAG)
- Implement proper TypeScript types
- Use ESLint and Prettier for code quality

### ❌ **DON'Ts:**

#### Content & Development
- **DON'T** hardcode content (everything should be CMS-manageable)
- **DON'T** skip performance optimization
- **DON'T** ignore accessibility standards
- **DON'T** use heavy libraries unnecessarily
- **DON'T** implement features not in the specification
- **DON'T** skip TypeScript type definitions
- **DON'T** use inline styles (use Tailwind classes)
- **DON'T** create non-responsive components

#### Technical Restrictions
- **DON'T** use wrong color codes (stick to specified palette)
- **DON'T** use fonts other than Poppins
- **DON'T** skip mobile optimization
- **DON'T** ignore SEO best practices
- **DON'T** create components without proper documentation
- **DON'T** skip error handling
- **DON'T** use deprecated or unsafe practices

---

## 📋 Quick Reference Summary

| Aspect | Details |
|--------|--------|
| **Languages** | Indonesian (Primary), English (Secondary) |
| **Target Market** | Indonesian tourism, Islamic travel, international tourists |
| **Primary Colors** | #39ace7, #9bd4e4, #cadeef, #0784b5 |
| **Secondary Colors** | #ffffff, #cadeef |
| **Accent Colors** | #9bd4e4 |
| **Font** | Poppins (Google Fonts) |
| **Style** | Corporate/Professional |
| **Framework** | Next.js 14 + TypeScript |
| **CMS** | Sanity.io |
| **Styling** | Tailwind CSS |

---

**Last Updated:** September 16, 2025
**Project:** Mahabbatussholihin Tour & Travel Landing Page
**Domain:** tour.mahabbatussholihin.com