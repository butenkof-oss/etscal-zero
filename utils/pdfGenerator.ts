import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface PDFData {
  email: string;
  price: number;
  shipping: number;
  cost: number;
  profit: number;
}

export async function generatePDF(data: PDFData): Promise<ArrayBuffer> {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('EtsyCalc PDF Report', 105, 20, { align: 'center' });

  // User info
  doc.setFontSize(12);
  doc.text(`Email: ${data.email}`, 20, 40);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);

  // Input Data
  doc.setFontSize(14);
  doc.text('Input Data', 20, 70);
  doc.setFontSize(12);
  doc.text(`Product Price: ${data.price} RUB`, 20, 80); // RUB = символ рубля
  doc.text(`Shipping: ${data.shipping} RUB`, 20, 90);
  doc.text(`Cost: ${data.cost} RUB`, 20, 100);

  // Net Profit (green)
  doc.setFontSize(16);
  doc.setTextColor(0, 128, 0);
  doc.text(`Net Profit: ${data.profit} RUB`, 20, 120);
  doc.setTextColor(0, 0, 0);

  // Etsy Fees
  const listingFee = 20;
  const transactionFee = (data.price + data.shipping) * 0.065;
  const processingFee = (data.price + data.shipping) * 0.03 + 25;
  const totalFees = listingFee + transactionFee + processingFee;

  doc.setFontSize(14);
  doc.text('Etsy Fees', 20, 140);
  doc.setFontSize(12);
  doc.text(`Listing Fee: ${listingFee} RUB`, 20, 150);
  doc.text(`Transaction (6.5%): ${transactionFee.toFixed(2)} RUB`, 20, 160);
  doc.text(`Processing (3% + 25RUB): ${processingFee.toFixed(2)} RUB`, 20, 170);
  doc.text(`Total Fees: ${totalFees.toFixed(2)} RUB`, 20, 180);

  // QR Code
  const qrData = `https://etscal-zero.vercel.app/verify?email=${encodeURIComponent(data.email)}&date=${Date.now()}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, { width: 100 });
    doc.addImage(qrDataUrl, 'PNG', 150, 190, 40, 40);
    doc.setFontSize(10);
    doc.text('Scan to verify', 150, 240);
  } catch (e) {
    doc.setFontSize(10);
    doc.text('QR: ' + qrData.substring(0, 50) + '...', 20, 200);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated automatically by EtsyCalc', 105, 280, { align: 'center' });

  return doc.output('arraybuffer');
}