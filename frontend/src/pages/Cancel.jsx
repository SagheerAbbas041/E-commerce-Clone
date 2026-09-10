import React from 'react'
import { Link } from 'react-router-dom'
import { MdCancel } from 'react-icons/md'

const Cancel = () => {
  return (
    <div className='min-h-[calc(100vh-120px)] w-full flex items-center justify-center p-4 bg-slate-50'>
      <div className='bg-white w-full max-w-md mx-auto flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl shadow-md border border-slate-100 text-center animate-fadeIn'>
        {/* Cancel Icon */}
        <div className='bg-red-50 text-red-600 p-3 sm:p-4 rounded-full mb-4 shadow-inner'>
          <MdCancel className='text-5xl sm:text-6xl' />
        </div>

        {/* Message */}
        <h2 className='text-red-600 font-bold text-xl sm:text-2xl mb-1'>
          Payment Cancelled!
        </h2>
        <p className='text-slate-500 text-xs sm:text-sm mb-6 max-w-xs'>
          Your transaction was not completed. Don't worry, no charges were made.
        </p>

        {/* Action Button */}
        <Link 
          to={"/cart"} 
          className='w-full sm:w-auto px-6 py-2.5 border-2 border-red-600 rounded-full font-semibold text-xs sm:text-sm text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm active:scale-95 flex items-center justify-center'
        >
          Return to Cart
        </Link>
      </div>
    </div>
  )
}

export default Cancel