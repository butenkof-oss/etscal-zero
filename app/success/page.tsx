import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl p-8 max-w-md w-full text-center'>
        <div className='text-green-600 text-6xl mb-4'>✓</div>
        <h1 className='text-2xl font-bold mb-4'>Оплата успешна!</h1>
        <p className='text-gray-600 mb-6'>
          PDF-отчет будет отправлен на ваш email в течение 5 минут.
        </p>
        <Link 
          href='/' 
          className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}