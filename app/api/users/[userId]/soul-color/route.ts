import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUser, createUser } from '@/lib/storage/userStore';
import { assignSoulColor, analyzeSoulColorWithReasoning } from '@/lib/services/geminiService';
import { isValidSoulColorId } from '@/lib/constants/soulColors';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = (await params).userId;
  const user = getUser(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = (await params).userId;
  const body = await request.json();

  // Case 1: Direct soul color assignment
  if (body.soulColorId) {
    if (!isValidSoulColorId(body.soulColorId)) {
      return NextResponse.json(
        { error: 'Invalid soul color ID' },
        { status: 400 }
      );
    }

    let user = getUser(userId);
    if (!user) {
      user = createUser(userId, body.name || 'User', body.email || '');
    }

    const updated = updateUser(userId, { soulColorId: body.soulColorId });
    return NextResponse.json({ user: updated });
  }

  // Case 2: Analyze responses and assign soul color via Gemini
  if (body.responses && Array.isArray(body.responses) && body.responses.length > 0) {
    const result = await analyzeSoulColorWithReasoning(body.responses);

    let user = getUser(userId);
    if (!user) {
      user = createUser(userId, body.name || 'User', body.email || '');
    }

    const updated = updateUser(userId, { soulColorId: result.soulColorId });

    return NextResponse.json({
      user: updated,
      analysis: {
        soulColorId: result.soulColorId,
        reasoning: result.reasoning,
      },
    });
  }

  return NextResponse.json(
    { error: 'Must provide either soulColorId or responses array' },
    { status: 400 }
  );
}
