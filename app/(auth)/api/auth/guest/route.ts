import { signIn } from '@/app/(auth)/auth';
import { isProductionEnvironment } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirectUrl') || '/';

  // Get base URL for cookies
  const baseUrl = request.headers.get('host') || '';

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isProductionEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Use the absolute URL for redirection to avoid middleware interception
  const callbackUrl = new URL(redirectUrl).toString();

  // Pass a special parameter to prevent redirect loops
  return signIn('guest', {
    redirect: true,
    redirectTo: callbackUrl,
    callbackUrl: callbackUrl,
  });
}
