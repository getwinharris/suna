'use server';

import { createTrialCheckout } from '@/lib/api/billing';
import { sanitizeAuthReturnUrl } from '@/lib/auth/return-url';
import { createClient } from '@/lib/trailbase/server';
import { getServerPublicEnv } from '@/lib/public-env-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { BAPX_TRAILBASE_AUTH_COOKIE } from '@/lib/trailbase/client';

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const returnUrl = sanitizeAuthReturnUrl(formData.get('returnUrl') as string | undefined);
  const password = formData.get('password') as string || 'password123'; // Default for dev, should be from form in prod

  if (!email || !email.includes('@')) {
    return { message: 'Please enter a valid email address' };
  }

  const trailbase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await trailbase.auth.signIn(normalizedEmail, password);
    
    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, trailbase.auth.getToken(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true, message: 'Signed in successfully', redirectTo: returnUrl };
  } catch (err: any) {
    return { message: err.message || 'Authentication failed' };
  }
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const returnUrl = sanitizeAuthReturnUrl(formData.get('returnUrl') as string | undefined);
  const acceptedTerms = formData.get('acceptedTerms') === 'true';
  const password = formData.get('password') as string || 'password123';

  if (!email || !email.includes('@')) {
    return { message: 'Please enter a valid email address' };
  }

  if (!acceptedTerms) {
    return { message: 'Please accept the terms and conditions' };
  }

  const trailbase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await trailbase.auth.signUp(normalizedEmail, password);
    
    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, trailbase.auth.getToken(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true, message: 'Account created and signed in', redirectTo: returnUrl };
  } catch (err: any) {
    return { message: err.message || 'Signup failed' };
  }
}

export async function selfHostedSignIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const returnUrl = sanitizeAuthReturnUrl(formData.get('returnUrl') as string | undefined);

  const trailbase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await trailbase.auth.signIn(normalizedEmail, password);
    const token = trailbase.auth.getToken();
    
    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { 
      success: true, 
      accessToken: token, 
      refreshToken: 'dummy-refresh-token', // Trailbase handles refresh via internal state if needed
      redirectTo: returnUrl 
    };
  } catch (err: any) {
    return { message: err.message || 'Authentication failed' };
  }
}

export async function installOwner(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const trailbase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // For self-hosted, we treat the first signup as the owner installation
    await trailbase.auth.signUp(normalizedEmail, password);
    const token = trailbase.auth.getToken();
    
    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { 
      success: true, 
      accessToken: token,
      message: 'Owner account created successfully' 
    };
  } catch (err: any) {
    return { message: err.message || 'Installation failed' };
  }
}

export async function signInWithPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const returnUrl = sanitizeAuthReturnUrl(formData.get('returnUrl') as string | undefined);

  if (!email || !password) {
    return { message: 'Email and password are required' };
  }

  const trailbase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await trailbase.auth.signIn(normalizedEmail, password);
    const token = trailbase.auth.getToken();
    
    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true, message: 'Signed in successfully', redirectTo: returnUrl };
  } catch (err: any) {
    return { message: err.message || 'Authentication failed' };
  }
}

export async function sendOtpCode(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { message: 'Email is required' };

  const trailbase = await createClient();
  try {
    // Trailbase OTP method
    await trailbase.auth.sendOtp(email.trim().toLowerCase());
    return { success: true, message: 'OTP sent successfully' };
  } catch (err: any) {
    return { message: err.message || 'Failed to send OTP' };
  }
}

export async function verifyOtp(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const returnUrl = sanitizeAuthReturnUrl(formData.get('returnUrl') as string | undefined);

  if (!email || !token) return { message: 'Email and code are required' };

  const trailbase = await createClient();
  try {
    await trailbase.auth.verifyOtp(email.trim().toLowerCase(), token);
    const jwt = trailbase.auth.getToken();

    const cookieStore = await cookies();
    cookieStore.set(BAPX_TRAILBASE_AUTH_COOKIE, jwt, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true, message: 'Verified successfully', redirectTo: returnUrl };
  } catch (err: any) {
    return { message: err.message || 'Verification failed' };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(BAPX_TRAILBASE_AUTH_COOKIE);
  return redirect('/');
}

export async function requestAccess(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const company = formData.get('company') as string | undefined;
  const useCase = formData.get('useCase') as string | undefined;

  if (!email || !email.includes('@')) {
    return { message: 'Please enter a valid email address' };
  }

  try {
    const backendUrl = getServerPublicEnv().BACKEND_URL || 'http://localhost:8008/v1';
    const res = await fetch(`${backendUrl}/access/request-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        company: company?.trim() || undefined,
        useCase: useCase?.trim() || undefined,
      }),
    });
    if (res.ok) {
      return { success: true, message: 'Your access request has been submitted. We\'ll be in touch!' };
    }
    return { message: 'Failed to submit request. Please try again.' };
  } catch {
    return { message: 'Failed to submit request. Please try again.' };
  }
}
