import { Metadata } from 'next'
import { sanityFetch, queries } from '@/sanity/lib/client'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and commitment to providing exceptional travel experiences.',
}

interface SiteSettings {
  siteName?: string
  siteDescription?: string
  aboutUs?: {
    title?: string
    subtitle?: string
    story?: string
    mission?: string
    whyChooseUs?: string[]
  }
}

export default async function AboutPage() {
  let siteSettings: SiteSettings | null = null
  
  try {
    siteSettings = await sanityFetch<SiteSettings>({
      query: queries.getSiteSettings(),
      tags: ['siteSettings'],
    })
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
  }

  return (
    <div className="min-h-screen bg-secondary-light py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            {siteSettings?.aboutUs?.title || 'About Us'}
          </h1>
          {siteSettings?.aboutUs?.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {siteSettings.aboutUs.subtitle}
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {siteSettings?.aboutUs?.story && (
            <>
              <h2 className="text-2xl font-semibold text-black mb-4">Our Story</h2>
              <p className="text-gray-700 mb-6">
                {siteSettings.aboutUs.story}
              </p>
            </>
          )}
          
          {siteSettings?.aboutUs?.mission && (
            <>
              <h2 className="text-2xl font-semibold text-black mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                {siteSettings.aboutUs.mission}
              </p>
            </>
          )}
          
          {siteSettings?.aboutUs?.whyChooseUs && siteSettings.aboutUs.whyChooseUs.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-black mb-4">Why Choose Us</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {siteSettings.aboutUs.whyChooseUs.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}