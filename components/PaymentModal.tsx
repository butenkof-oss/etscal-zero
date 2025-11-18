'use client';
import { useState } from 'react';

export default function PaymentModal({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'paid'>('idle');

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

  const checkPaymentStatus = async () => {
    // Проверяем статус (в реальном кейсе — запрос к базе)
    setStatus('paid');
    alert('PDF отправлен на ваш email!');
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
                ⚠️ Введите сумму <strong>{amount} RUB</strong> вручную при оплате
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
            <p className='text-xs text-gray-500 mb-4'>Скопируйте и отправьте дсылку:</p>
            
            <div className='bg-gray-100 p-3 rounded-lg mb-4">
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
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-2"
            >
              📋 Скопировать ссылку
            </button>
            
            {status === 'idle' ? (
              <div className='bg-blue-100 p-3 rounded-lg">
                <p className='text-sm text-blue-800 mb-2">
                  📧 После оплаты PDF придёт автоматически на email
                </p>
                <button 
                  onClick={checkPaymentStatus} 
                  className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  ✓ Я оплатил, проверить статус
                </button>
              </div>
            ) : (
              <div className='bg-green-100 p-3 rounded-lg">
                <p className='text-green-600 font-medium">✅ PDF отправлен на email!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}