'use client';
import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';

export default function EtsyCalculator() {
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');
  const [cost, setCost] = useState('');
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
    
    const finalProfit = Math.round(netProfit * 100) / 100;
    setProfit(finalProfit);

    // Сохраняем в localStorage для PDF
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecalc_price', price);
      localStorage.setItem('ecalc_shipping', shipping);
      localStorage.setItem('ecalc_cost', cost);
      localStorage.setItem('ecalc_profit', finalProfit.toString());
    }
  };

  return (
    <div className='space-y-4 max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Калькулятор прибыли Etsy</h2>
      
      <input type='number' placeholder='Цена товара (₽)' value={price} onChange={(e) => setPrice(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      <input type='number' placeholder='Доставка (₽)' value={shipping} onChange={(e) => setShipping(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      <input type='number' placeholder='Себестоимость (₽)' value={cost} onChange={(e) => setCost(e.target.value)} className='w-full px-4 py-2 border border-gray-300 rounded-lg' />
      
      <button onClick={calculate} className='w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium'>
        Посчитать
      </button>

      {profit !== 0 && (
        <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
          <p className='text-lg mb-4'>
            Чистая прибыль: <span className='font-bold text-green-600'>{profit} ₽</span>
          </p>
          <button 
            onClick={() => setShowPayment(true)} 
            className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium'
          >
            📄 Скачать PDF отчет (199 ₽)
          </button>
        </div>
      )}

      {showPayment && <PaymentModal amount={199} onSuccess={() => setShowPayment(false)} />}
    </div>
  );
}