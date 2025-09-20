'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { sanityFetch, queries } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useTranslations } from 'next-intl'

interface SiteSettings {
  _id: string
  logo?: {
    asset: {
      _id: string
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
  }
  logoAlt?: string
  siteName?: string
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('navigation')
  
  // Simple language detection from URL
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'id'

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await sanityFetch<SiteSettings>({
          query: queries.getSiteSettings(),
          tags: ['siteSettings'],
        })
        setSiteSettings(settings)
      } catch (error) {
        console.error('Failed to fetch site settings:', error)
      }
    }

    fetchSiteSettings()
  }, [])

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('services'), href: '/services' },
    { name: t('gallery'), href: '/gallery' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '/contact' },
  ]

  const switchLocale = (newLocale: string) => {
    // Simple locale switching logic
    let newPath = pathname
    
    if (pathname.startsWith('/en')) {
      // Remove /en prefix
      newPath = pathname.substring(3) || '/'
    } else if (pathname.startsWith('/id')) {
      // Remove /id prefix  
      newPath = pathname.substring(3) || '/'
    }
    
    // Add new locale prefix
    const finalPath = `/${newLocale}${newPath === '/' ? '' : newPath}`
    router.push(finalPath)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/id' || pathname === '/en'
    }
    // Check if current path matches (considering locale prefixes)
    const pathWithoutLocale = pathname.replace(/^\/(id|en)/, '') || '/'
    if (href === '/') {
      return pathWithoutLocale === '/'
    }
    return pathWithoutLocale.startsWith(href)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {siteSettings?.logo ? (
                <Image
                  src={urlFor(siteSettings.logo).width(200).height(60).url()}
                  alt={siteSettings.logoAlt || 'Company Logo'}
                  width={200}
                  height={60}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {siteSettings?.siteName || 'Mahabbatussholihin Tour & Travel'}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary'
              : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="flex space-x-1 ml-4 border-l pl-4">
              <button
                onClick={() => switchLocale('id')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  currentLocale === 'id'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  currentLocale === 'en'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/contact"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? 'text-primary bg-primary-lighter'
                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="px-3 py-2 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-2">Language / Bahasa</p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  switchLocale('id')
                  setIsMenuOpen(false)
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                  currentLocale === 'id'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100 border border-gray-300'
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                onClick={() => {
                  switchLocale('en')
                  setIsMenuOpen(false)
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                  currentLocale === 'en'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100 border border-gray-300'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          <div className="px-3 py-2">
            <Link
              href="/contact"
              className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header