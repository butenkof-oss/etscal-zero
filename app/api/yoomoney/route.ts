import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  const url = new URL('https://yoomoney.ru/to/4100118602371960');
  url.searchParams.set('sum', '199.00'); // ✅ Реальная сумма
  url.searchParams.set('comment', 'EtsyCalc PDF - ' + email);

  return NextResponse.json({ url: url.toString() });
}