import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch rates securely from the server.
    // Next.js will cache this request for 24 hours (86400 seconds)
    // so we don't hit the external API on every user visit.
    const rateRes = await fetch('https://open.er-api.com/v6/latest/NGN', {
      next: { revalidate: 86400 }
    });
    
    if (!rateRes.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const rateData = await rateRes.json();
    return NextResponse.json(rateData);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
