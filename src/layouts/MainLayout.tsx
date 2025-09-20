'use client'

import { ReactNode, useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { sanityFetch, queries } from '@/sanity/lib/client'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    // Fetch WhatsApp number from CMS
    async function fetchWhatsApp() {
      try {
        const siteSettings = await sanityFetch<any>({
          query: queries.getSiteSettings(),
          tags: ['siteSettings']
        })
        
        if (siteSettings?.contactInfo?.whatsapp) {
          setWhatsappNumber(siteSettings.contactInfo.whatsapp)
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp number:', error)
      }
    }

    fetchWhatsApp()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button - Only show if WhatsApp number exists in CMS */}
      {whatsappNumber && (
        <WhatsAppFloat 
          phoneNumber={whatsappNumber}
          message="Hello! I'm interested in your tour services. Can you help me with more information?"
        />
      )}
    </div>
  )
}

export default MainLayout