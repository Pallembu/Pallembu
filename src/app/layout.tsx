import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import MainLayout from "../layouts/MainLayout";
import { headers } from "next/headers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tour & Travel - Your Trusted Travel Partner",
    template: "%s | Tour & Travel"
  },
  description: "Explore the world with our trusted tour and travel services. Discover amazing destinations with expertly crafted tour packages.",
  keywords: ["tour", "travel", "vacation", "holiday", "tourism", "Indonesia", "travel agency", "tour packages"],
  authors: [{ name: "Tour & Travel" }],
  creator: "Tour & Travel",
  publisher: "Tour & Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tour & Travel - Your Trusted Travel Partner",
    description: "Explore the world with our trusted tour and travel services.",
    url: 'https://localhost:3000',
    siteName: 'Tour & Travel',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tour & Travel - Your Trusted Travel Partner",
    description: "Explore the world with our trusted tour and travel services.",
    creator: '@tourtravelid',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if it's a studio route - be specific about the path
  const isStudioRoute = pathname === '/studio' || pathname.startsWith('/studio/');
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Layout Debug - pathname:', pathname, 'isStudioRoute:', isStudioRoute);
  }
  
  // Simple locale detection - default to Indonesian
  let locale = 'id';
  
  // Check if URL contains /en to use English
  if (pathname.includes('/en')) {
    locale = 'en';
  }
  
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {isStudioRoute ? children : <MainLayout>{children}</MainLayout>}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
