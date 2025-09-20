import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { client } from '@/sanity/lib/client'
import { ratelimit, getClientIP, rateLimitErrorResponse } from '@/lib/rateLimit'
import { 
  contactFormSchema, 
  validateSubmissionTiming,
  generateCSRFToken,
  type SanitizedContactForm 
} from '@/lib/inputValidation'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = getClientIP(request)
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return rateLimitErrorResponse()
    }

    const body = await request.json()
    
    // Additional security checks
    
    // 1. Check for honeypot field (bot detection)
    if (body.website) {
      return NextResponse.json(
        { error: 'Submission rejected' },
        { status: 400 }
      )
    }
    
    // 2. Validate submission timing (prevent automated submissions)
    if (body.timestamp && !validateSubmissionTiming(body.timestamp)) {
      return NextResponse.json(
        { error: 'Invalid submission timing' },
        { status: 400 }
      )
    }
    
    // 3. Check Content-Type header
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }
    
    // 4. Validate request size (prevent large payloads)
    const bodyString = JSON.stringify(body)
    if (bodyString.length > 10000) { // 10KB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }
    
    // Validate with enhanced Zod schema (includes sanitization)
    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'Please check your form data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Get client IP and user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Prepare the document for Sanity
    const contactDoc = {
      _type: 'contactSubmission',
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || '',
      subject: validatedData.subject,
      message: validatedData.message,
      tourInterest: validatedData.tourInterest || '',
      travelDate: validatedData.travelDate || null,
      groupSize: validatedData.groupSize ? parseInt(validatedData.groupSize) : null,
      budget: validatedData.budget || '',
      status: 'new',
      submittedAt: new Date().toISOString(),
      ipAddress: ip,
      userAgent: userAgent
    }

    // Create the document in Sanity
    const result = await client.create(contactDoc)

    // Send email notification
    await sendEmailNotification(contactDoc)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! We will get back to you within 24 hours.',
        id: result._id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form submission error:', error)
    
    // Return different error messages based on error type
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          message: 'Please check your form data',
          details: error.issues
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'We are experiencing technical difficulties. Please try again later or contact us directly.'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (method not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

// Email notification function
async function sendEmailNotification(contactDoc: any) {
  try {
    // Skip email sending if environment variables are not configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP not configured. Contact form data saved to CMS only.')
      console.log('New contact form submission:', {
        name: contactDoc.name,
        email: contactDoc.email,
        subject: contactDoc.subject
      })
      return
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email to business owner
    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #39ace7 0%, #9bd4e4 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
          <p style="color: #f0f8ff; margin: 10px 0 0 0;">Tour & Travel</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td><td style="padding: 8px 0;">${contactDoc.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${contactDoc.email}" style="color: #39ace7;">${contactDoc.email}</a></td></tr>
              ${contactDoc.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${contactDoc.phone}" style="color: #39ace7;">${contactDoc.phone}</a></td></tr>` : ''}
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Subject:</td><td style="padding: 8px 0;">${contactDoc.subject}</td></tr>
            </table>
          </div>

          ${contactDoc.tourInterest || contactDoc.travelDate || contactDoc.groupSize || contactDoc.budget ? `
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Trip Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${contactDoc.tourInterest ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Tour Interest:</td><td style="padding: 8px 0;">${contactDoc.tourInterest}</td></tr>` : ''}
              ${contactDoc.travelDate ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Travel Date:</td><td style="padding: 8px 0;">${contactDoc.travelDate}</td></tr>` : ''}
              ${contactDoc.groupSize ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Group Size:</td><td style="padding: 8px 0;">${contactDoc.groupSize} travelers</td></tr>` : ''}
              ${contactDoc.budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Budget:</td><td style="padding: 8px 0;">${contactDoc.budget}</td></tr>` : ''}
            </table>
          </div>
          ` : ''}

          <div style="background: white; padding: 25px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #39ace7;">
              ${contactDoc.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #333; color: #ccc;">
          <p style="margin: 0; font-size: 14px;">Submitted at: ${new Date(contactDoc.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
        </div>
      </div>
    `

    // Send email to business
    await transporter.sendMail({
      from: `"MHS Tour Contact Form" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `New Contact Form: ${contactDoc.subject}`,
      html: businessEmailHtml,
    })

    // Auto-reply to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #39ace7 0%, #9bd4e4 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Terima Kasih!</h1>
          <p style="color: #f0f8ff; margin: 10px 0 0 0;">Thank You for Contacting Us</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <div style="background: white; padding: 25px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Halo ${contactDoc.name},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Terima kasih telah menghubungi kami. 
              Kami telah menerima pesan Anda dengan subject "<em>${contactDoc.subject}</em>".
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Tim kami akan segera menghubungi Anda dalam waktu <strong>24 jam</strong> 
              untuk memberikan informasi lengkap sesuai kebutuhan perjalanan Anda.
            </p>
            
            <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #39ace7; margin: 20px 0;">
              <p style="margin: 0; color: #555;">
                <strong>Untuk pertanyaan urgent, silakan hubungi:</strong><br>
                📱 WhatsApp: <a href="https://wa.me/6281234567890" style="color: #39ace7;">+62 812 3456 7890</a><br>
                📧 Email: <a href="mailto:info@example.com" style="color: #39ace7;">info@example.com</a>
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
              Salam hangat,<br>
              <strong>Tim Customer Service</strong><br>
              <em>Mitra Terpercaya untuk Perjalanan Terbaik</em>
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #333; color: #ccc;">
          <p style="margin: 0; font-size: 14px;">© 2025 Tour & Travel</p>
        </div>
      </div>
    `

    // Send auto-reply to customer
    await transporter.sendMail({
      from: `"Tour & Travel" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: contactDoc.email,
      subject: `Terima kasih atas pesan Anda - ${contactDoc.subject}`,
      html: customerEmailHtml,
    })

    console.log('Email notifications sent successfully')

  } catch (error) {
    console.error('Failed to send email notification:', error)
    // Don't throw error - form submission should still succeed
  }
}