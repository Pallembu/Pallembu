# Tech Stack Reference - Code Implementation

## 🚀 Core Framework

### Next.js 14+
```bash
# Installation command
npx create-next-app@latest mhs-tour-landing-page --typescript --tailwind --eslint --app
```

**Configuration:**
- App Router (not Pages Router)
- TypeScript strict mode
- Static Site Generation (SSG) primary
- Incremental Static Regeneration (ISR) for CMS content

## 📦 Package Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "next-sanity": "^7.0.0",
    "@portabletext/react": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "framer-motion": "^10.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.0.0",
    "@vercel/analytics": "^1.0.0",
    "react-intersection-observer": "^9.5.0",
    "embla-carousel-react": "^8.0.0",
    "react-hot-toast": "^2.4.0",
    "next-intl": "^3.0.0",
    "@formatjs/intl-localematcher": "^0.5.0",
    "negotiator": "^0.6.0"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/negotiator": "^0.6.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-prettier": "^9.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "@next/bundle-analyzer": "^14.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

## 🎨 Styling & UI

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#39ace7',
          light: '#9bd4e4',
          lighter: '#cadeef',
          dark: '#0784b5',
        },
        secondary: {
          DEFAULT: '#ffffff',
          light: '#cadeef',
        },
        accent: {
          DEFAULT: '#9bd4e4',
        },
      },
    },
  },
  plugins: [],
}
```

### Font Integration
```typescript
// app/layout.tsx
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})
```

## 🗄️ Content Management (Sanity)

### Sanity Setup Command
```bash
# Initialize Sanity Studio
npm create sanity@latest -- --project piwmx6fh --dataset production --template clean
```

### Sanity Configuration
```typescript
// sanity/config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'mhs-tour-cms',
  title: 'MHS Tour CMS',
  projectId: 'piwmx6fh',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

### Required Sanity Schemas
- `hero` - Hero section content
- `feature` - Features/services
- `testimonial` - Customer testimonials
- `blogPost` - Blog articles
- `portfolioItem` - Gallery/portfolio
- `contactInfo` - Contact details
- `siteSettings` - Global site settings

## 🔧 Development Tools

### ESLint Configuration (Priority)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn",
    "prettier/prettier": "off"
  }
}
```

### Prettier Configuration (Formatting Only)
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"],
  "eslintIntegration": true
}
```

### Husky + Lint-Staged Configuration
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

```bash
# Setup commands
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Bundle Analyzer Configuration (Dev Only)
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... other config
})
```

```json
// package.json scripts
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:server": "BUNDLE_ANALYZE=server npm run build",
    "analyze:browser": "BUNDLE_ANALYZE=browser npm run build"
  }
}
```

### Important Rules:
- **ESLint takes precedence** over Prettier for all code quality rules
- **eslint-config-prettier** disables conflicting ESLint formatting rules
- **prettier/prettier: "off"** prevents Prettier from overriding ESLint
- **Prettier only handles** indentation, spacing, and Tailwind class sorting
- **Never bypass ESLint rules** - if conflict occurs, adjust Prettier config
- **Bundle analyzer** is dev-only tool, automatically excluded from production
- **Husky hooks** run before every commit to ensure code quality

## 📁 Project Structure

```
mhs-tour-landing-page/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   └── portfolio/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── sections/
│   │   ├── forms/
│   │   └── layout/
│   ├── lib/
│   │   ├── sanity.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
├── sanity/
│   ├── schemas/
│   ├── config.ts
│   └── studio/
├── public/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🌐 Internationalization

### Next-Intl Setup
```bash
npm install next-intl @formatjs/intl-localematcher negotiator
npm install --save-dev @types/negotiator
```

**Supported Languages:**
- Indonesian (id) - Primary
- English (en) - Secondary

### Internationalization Configuration

#### Middleware Configuration
```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'as-needed'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\.).*)'],
}
```

#### Next-Intl Configuration
```typescript
// src/i18n.ts
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['id', 'en']

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
```

#### Translation Files Structure
```
src/
├── messages/
│   ├── id.json    # Indonesian translations
│   └── en.json    # English translations
```

#### Example Translation Files
```json
// messages/id.json
{
  "navigation": {
    "home": "Beranda",
    "about": "Tentang",
    "services": "Layanan",
    "contact": "Kontak"
  },
  "hero": {
    "title": "Jelajahi Keindahan Indonesia",
    "subtitle": "Temukan destinasi wisata terbaik dengan paket tour terpercaya"
  }
}
```

```json
// messages/en.json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact"
  },
  "hero": {
    "title": "Explore the Beauty of Indonesia",
    "subtitle": "Discover the best tourist destinations with trusted tour packages"
  }
}
```

#### Usage in Components
```typescript
// Client Components
import { useTranslations } from 'next-intl'

export default function Navigation() {
  const t = useTranslations('navigation')
  
  return (
    <nav>
      <Link href="/">{t('home')}</Link>
      <Link href="/about">{t('about')}</Link>
    </nav>
  )
}

// Server Components
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('hero')
  
  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </section>
  )
}
```

#### Language Switcher Component
```typescript
// components/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => switchLanguage('id')}
        className={locale === 'id' ? 'font-bold' : ''}
      >
        ID
      </button>
      <button 
        onClick={() => switchLanguage('en')}
        className={locale === 'en' ? 'font-bold' : ''}
      >
        EN
      </button>
    </div>
  )
}
```

## 📊 Performance & SEO

### Next.js Configuration
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
})
```

### Vercel Analytics Setup
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Required Optimizations
- Image optimization with Next/Image
- Font optimization with next/font
- Code splitting with dynamic imports
- Bundle analysis with @next/bundle-analyzer

## 🔒 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=piwmx6fh
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skg5c7Vs1l8JPF1hLULUAXWNcsvDH1ISlUjLUkbhU6yXvVMSEfcXASVGf0jP8VIr1qzt9W4AkXjPP7N1uf6XesV7MTga61SsNYK3sNectU3yYd7GKXvTlyWtECj5ec12RcFIAtzOOfvsod4EI3sSYjcESuDq1XWmluLXh3WR0kusDhYnkyj7
NEXT_PUBLIC_SITE_URL=https://tour.mahabbatussholihin.com

# Development only
ANALYZE=false
```

## 🚫 What NOT to Use

- ❌ Pages Router (use App Router only)
- ❌ CSS Modules (use Tailwind only)
- ❌ Styled Components (use Tailwind only)
- ❌ jQuery or other DOM manipulation libraries
- ❌ Heavy animation libraries (use Framer Motion sparingly)
- ❌ Unnecessary third-party components

## ✅ Coding Standards

1. **TypeScript**: Strict mode, no `any` types
2. **Components**: Functional components with hooks
3. **Styling**: Tailwind utility classes only
4. **State**: React hooks, no external state management
5. **Forms**: React Hook Form with Zod validation
6. **Images**: Next/Image component always
7. **Links**: Next/Link component always
8. **SEO**: Next/Head or metadata API

---

**This is the definitive tech stack reference. Follow this exactly to avoid confusion and ensure consistency.**