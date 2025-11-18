'use client';
import { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentModal({ amount, onSuccess }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Генерируем ссылку
  const email = typeof window !== 'undefined' ? localStorage.getItem('ecalc_email') || 'user@example.com' : 'user@example.com';
  const wallet = '4100118602371960';
  const comment = `EtsyCalc PDF ${email}`;
  const paymentUrl = `https://yoomoney.ru/to/${wallet}?sum=${amount}&comment=${encodeURIComponent(comment)}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayNow = () => {
    setProcessing(true);
    window.location.href = paymentUrl;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 max-w-sm w-full'>
        <h3 className='text-xl font-bold mb-4'>Оплата PDF отчета</h3>
        <p className='mb-4'>Сумма: {amount} ₽</p>
        
        {/* Кнопка "Скопировать ссылку" */}
        <button 
          onClick={handleCopyLink}
          className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-3'
        >
          {copied ? '✅ Скопировано!' : '📋 Скопировать ссылку'}
        </button>

        {/* Кнопка "Оплатить сейчас" */}
        <button 
          onClick={handlePayNow}
          disabled={processing}
          className='w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400'
        >
          {processing ? 'Обработка...' : '💳 Оплатить сейчас'}
        </button>

        {/* Показываем ссылку для ручного копирования */}
        <div className='mt-4 p-3 bg-gray-100 rounded-lg text-xs break-all'>
          <p className='font-semibold mb-1'>Ссылка для ручной оплаты:</p>
          <p className='text-gray-600'>{paymentUrl}</p>
        </div>
      </div>
    </div>
  );
}