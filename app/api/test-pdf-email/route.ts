import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generatePDF } from '@/utils/pdfGenerator';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'test@example.com';

  try {
    // Генерируем тестовый PDF
    const pdfBuffer = await generatePDF({
      email,
      price: 1000,
      shipping: 500,
      cost: 1,
      profit: 9456.5
    });

    // Отправляем email
    await transporter.sendMail({
      from: `"EtsyCalc" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'EtsyCalc PDF Отчет (ТЕСТ)',
      text: 'Это тестовый PDF без реальной оплаты',
      attachments: [{
        content: Buffer.from(pdfBuffer).toString('base64'),
        filename: 'test-report.pdf',
        contentType: 'application/pdf'
      }]
    });

    return NextResponse.json({ 
      success: true, 
      message: `Тестовый PDF отправлен на ${email}` 
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}