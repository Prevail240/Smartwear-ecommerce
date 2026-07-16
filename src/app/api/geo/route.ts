import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // x-vercel-ip-country is automatically injected by Vercel on deployed apps.
  // We fall back to 'NG' (Nigeria) for local development or if the header is missing.
  const country = request.headers.get('x-vercel-ip-country') || 'NG';
  
  return NextResponse.json({ country });
}
