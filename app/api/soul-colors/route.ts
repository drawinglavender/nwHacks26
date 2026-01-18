import { NextResponse } from 'next/server';
import { SOUL_COLORS } from '@/lib/constants/soulColors';

export async function GET() {
  return NextResponse.json({ colors: SOUL_COLORS });
}
