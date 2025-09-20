import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/inputValidation';

export async function GET() {
  try {
    const token = generateCSRFToken();
    
    const response = NextResponse.json({ 
      csrfToken: token,
      expires: Date.now() + 3600000 // 1 hour
    });
    
    // Set CSRF token in httpOnly cookie for extra security
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('CSRF token generation failed:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}