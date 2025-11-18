'use client';
import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';

export default function EtsyCalculator() {
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');
  const [cost, setCost] = useState('');
  const [email, setEmail] = useState(''); // ДОБАВЛЯЕМ EMAIL
  const [profit, setProfit] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const calculate = () => {
    const p = parseFloat(price) || 0;
    const s = parseFloat(shipping) || 0;
    const c = parseFloat(cost) || 0;
    const listingFee = 20;
    const transactionFee = (p + s) * 0.065;
    const processingFee = (p + s) * 0.03 + 25;
    const totalFees = listingFee + transactionFee + processingFee;
    const netProfit = p + s - c - totalFees;
    setProfit(Math.round(netProfit * 100) / 100);

    // Сохраняем ВСЕ данные в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecalc_price', price);
      localStorage.setItem('ecalc_shipping', shipping);
      localStorage.setItem('ecalc_cost', cost);
      localStorage.setItem('ecalc_profit', netProfit.toString());
      localStorage.setItem('ecalc_email', email); // СОХРАНЯЕМ EMAIL
    }
  };

  return (
    <div className='space-y-4 max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>EtsyCalc — калькулятор прибыли для продавцов и ИП</h2>
      <p className='text-sm text-gray-600 mb-4'>Ozon, Wildberries, PayPal, Etsy — PDF-отчёт за 5 сек</p>
      
      {/* ПОЛЕ EMAIL */}
      <input 
        type='email' 
        placeholder='Ваш email для PDF отчёта' 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className='w-full px-4 py-2 border border-gray-300 rounded-lg'
      />
      
      <input type='number' placeholder='Цена товара (₽)' value={price} onChange={(e) => setPrice(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      <input type='number' placeholder='Доставка (₽)' value={shipping} onChange={(e) => setShipping(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      <input type='number' placeholder='Себестоимость (₽)' value={cost} onChange={(e) => setCost(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      
      <button onClick={calculate} className='w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium'>Посчитать</button>
      
      {profit !== 0 && (
        <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
          <p className='text-lg mb-2'>Чистая прибыль: <span className='font-bold text-green-600'>{profit} ₽</span></p>
          <p className='text-sm text-gray-600 mb-4'>Email для PDF: <span className='font-bold'>{email || 'не указан'}</span></p>
          <button onClick={() => setShowPayment(true)} className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium'>Скачать PDF-отчёт для налоговой (199 ₽)</button>
        </div>
      )}
      
      {showPayment && <PaymentModal amount={199} onSuccess={() => setShowPayment(false)} />}
    </div>
  );
}