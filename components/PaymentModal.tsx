'use client';
import { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentModal({ amount, onSuccess }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    
    // Генерируем ссылку на ЮMoney
    const wallet = '4100118602371960';
    const email = localStorage.getItem('ecalc_email') || 'user@example.com';
    const comment = `EtsyCalc PDF ${email}`;
    
    const paymentUrl = `https://yoomoney.ru/to/${wallet}?sum=${amount}&comment=${encodeURIComponent(comment)}`;
    
    // Редирект на ЮMoney
    window.location.href = paymentUrl;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 max-w-sm w-full'>
        <h3 className='text-xl font-bold mb-4'>Оплата PDF отчета</h3>
        <p className='mb-4'>Сумма: {amount} ₽</p>
        <button 
          onClick={handlePayment}
          disabled={processing}
          className='w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400'
        >
          {processing ? 'Обработка...' : 'Оплатить'}
        </button>
      </div>
    </div>
  );
}