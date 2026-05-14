import { NextRequest, NextResponse } from 'next/server';

type IntentType = 'portrait_selfie' | 'product_ecommerce' | 'generic_fallback';

function inferIntentType(text: string): IntentType {
  const source = text.toLowerCase();

  const portraitKeywords = [
    'portrait',
    'selfie',
    'person',
    'people',
    'face',
    'woman',
    'man',
    'girl',
    'boy',
    'avatar',
    '人像',
    '自拍',
    '人物',
    '写真',
  ];

  const productKeywords = [
    'product',
    'ecommerce',
    'item',
    'cosmetic',
    'skincare',
    'makeup',
    'shoe',
    'bag',
    'watch',
    'phone',
    'bottle',
    'food',
    'drink',
    '商品',
    '电商',
    '产品',
    '美妆',
    '服饰',
    '鞋',
    '包',
    '食品',
    '饮料',
  ];

  if (productKeywords.some((keyword) => source.includes(keyword))) {
    return 'product_ecommerce';
  }

  if (portraitKeywords.some((keyword) => source.includes(keyword))) {
    return 'portrait_selfie';
  }

  return 'generic_fallback';
}

export async function POST(req: NextRequest) {
  let body: {
    file_name?: string;
    sample_id?: string;
    image_url?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const signal = [body.file_name || '', body.sample_id || '', body.image_url || ''].join(' ');
  const intentType = inferIntentType(signal);

  const confidence =
    intentType === 'generic_fallback'
      ? 0.52
      : body.file_name || body.sample_id
      ? 0.88
      : 0.74;

  return NextResponse.json({
    intent_type: intentType,
    confidence,
  });
}
