'use client';
import { useState } from 'react';
import { generatePDF } from '@/utils/pdfGenerator';

export default function PaymentModal({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleYooMoney = async () => {
    const email = prompt('Введите email для получения PDF:');
    if (!email) return;
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/yoomoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const { url } = await res.json();
      setPaymentUrl(url);
      setShowLink(true);
    } catch (error) {
      alert('Ошибка генерации ссылки. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async () => {
    const email = prompt('Подтвердите email для PDF:') || 'user@example.com';
    
    const data = {
      email: email,
      price: parseFloat(localStorage.getItem('ecalc_price') || '0'),
      shipping: parseFloat(localStorage.getItem('ecalc_shipping') || '0'),
      cost: parseFloat(localStorage.getItem('ecalc_cost') || '0'),
      profit: parseFloat(localStorage.getItem('ecalc_profit') || '0')
    };

    try {
      const pdfBuffer = await generatePDF(data);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `etsy-report-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Ошибка генерации PDF');
    }

    onSuccess();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 max-w-sm w-full'>
        <h3 className='text-xl font-bold mb-4'>Оплата PDF отчета</h3>
        
        {!showLink ? (
          <>
            <div className='bg-yellow-100 p-3 rounded-lg mb-4'>
              <p className='text-sm text-yellow-800'>
                ⚠️ Введите сумму <strong>{amount} ₽</strong> вручную при оплате
              </p>
            </div>
            
            {loading ? (
              <div className='text-center py-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2'></div>
                <p className='text-sm text-gray-600'>Генерация ссылки...</p>
              </div>
            ) : (
              <button 
                onClick={handleYooMoney} 
                className='w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 font-medium'
              >
                💳 Сгенерировать ссылку для оплаты
              </button>
            )}
          </>
        ) : (
          <>
            <p className='text-green-600 font-medium mb-2'>✓ Ссылка создана!</p>
            <p className='text-xs text-gray-500 mb-4'>Скопируйте и отправьте доверенному лицу в РФ:</p>
            
            <div className='bg-gray-100 p-3 rounded-lg mb-4'>
              <input 
                type='text' 
                value={paymentUrl} 
                readOnly 
                className='w-full text-xs bg-transparent break-all'
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            
            <button 
              onClick={() => navigator.clipboard.writeText(paymentUrl)}
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-2'
            >
              📋 Скопировать ссылку
            </button>
            
            <button 
              onClick={handleSuccess} 
              className='w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700'
            >
              ✓ Я оплатил {amount} ₽, получить PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}