import { NextResponse, type NextRequest } from 'next/server';
import { isRouteEnabled } from '@/lib/features';

export function proxy(request: NextRequest) {
  if (!isRouteEnabled(request.nextUrl.pathname)) {
    // Decide before streaming starts, preserving a real HTTP 404 status.
    return NextResponse.rewrite(new URL('/release-module-unavailable', request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/painel/:path*', '/aluno/:path*'],
};
