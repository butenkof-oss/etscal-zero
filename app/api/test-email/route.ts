import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'test@example.com';

  const msg = {
    to: email,
    from: 'noreply@etscal-zero.vercel.app',
    subject: 'EtsyCalc Test Email',
    text: 'Если это письмо пришло — SendGrid работает!',
    html: '<strong>Если это письмо пришло — SendGrid работает!</strong>'
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json({ success: true, message: Email отправлен на  });
  } catch (error) {
    console.error('SendGrid error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
