import { NextResponse } from 'next/server';
import { generatePDF } from '@/utils/pdfGenerator';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Параметры от ЮMoney
    const amount = formData.get('amount');
    const label = formData.get('label'); // email клиента
    const sha1_hash = formData.get('sha1_hash');
    const notification_secret = formData.get('notification_secret');
    
    // Проверяем подпись
    const expectedHash = sha1(
      formData.get('notification_type') + '&' +
      formData.get('operation_id') + '&' +
      formData.get('amount') + '&' +
      formData.get('currency') + '&' +
      formData.get('datetime') + '&' +
      formData.get('sender') + '&' +
      formData.get('codepro') + '&' +
      process.env.YOOMONEY_SECRET_KEY
    );
    
    if (sha1_hash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Проверяем сумму
    if (parseFloat(amount as string) < 199) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Генерируем и отправляем PDF
    const testData = {
      email: label as string,
      price: 1000,
      shipping: 200,
      cost: 500,
      profit: 550
    };

    const pdfBuffer = await generatePDF(testData);
    
    const msg = {
      to: label as string,
      from: 'noreply@etscal-zero.vercel.app',
      subject: 'Your EtsyCalc PDF Report',
      text: 'Thank you for your purchase! Your PDF report is attached.',
      attachments: [
        {
          content: Buffer.from(pdfBuffer).toString('base64'),
          filename: 'etsy-report.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    await sgMail.send(msg);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function sha1(str: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}