import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import SummaryApi from '../common';

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // StrictMode / double effect execution prevent karne ke liye flag
  const isOrderSaved = useRef(false);

  useEffect(() => {
    const saveOrderData = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage("Invalid payment session ID.");
        return;
      }

      if (isOrderSaved.current) return;
      isOrderSaved.current = true;

      try {
        const response = await fetch(SummaryApi.saveOrder.url, {
          method: SummaryApi.saveOrder.method,
          credentials: 'include',
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ sessionId })
        });

        const responseData = await response.json();

        if (responseData?.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(responseData?.message || "Order registration failed.");
        }
      } catch (error) {
        console.error("Failed to save order:", error);
        setStatus('error');
        setErrorMessage("Network error while updating order details.");
      }
    };

    saveOrderData();
  }, [sessionId]);

  return (
    <section className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-slate-50'>
      <div className='bg-white p-8 sm:p-10 w-full max-w-md mx-auto rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center'>
        
        {/* Processing State */}
        {status === 'processing' && (
          <div className='py-6 flex flex-col items-center gap-4'>
            <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin' />
            <p className='text-slate-700 font-semibold text-lg'>Verifying Payment...</p>
            <p className='text-slate-400 text-sm'>Please wait while we confirm your order.</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className='flex flex-col items-center'>
            <div className='w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 text-5xl shadow-sm'>
              <FaCheckCircle />
            </div>
            <h2 className='text-2xl font-bold text-slate-800 mb-1'>Payment Successful!</h2>
            <p className='text-slate-500 text-sm mb-6'>
              Thank you for your purchase. Your order has been registered and is being processed.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 w-full'>
              <Link 
                to={"/order"} 
                className='w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center'
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className='flex flex-col items-center'>
            <div className='w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 text-4xl shadow-sm'>
              <FaExclamationTriangle />
            </div>
            <h2 className='text-xl font-bold text-slate-800 mb-1'>Order Process Issue</h2>
            <p className='text-slate-500 text-xs sm:text-sm mb-6'>
              {errorMessage}
            </p>
            <Link 
              to={"/cart"} 
              className='w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center text-sm'
            >
              Return to Cart
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default Success;