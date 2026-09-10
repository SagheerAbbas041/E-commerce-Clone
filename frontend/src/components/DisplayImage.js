import React from 'react'
import { CgClose } from 'react-icons/cg'

const DisplayImage = ({
    imgUrl,
    onClose
}) => {
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 transition-all'>

        <div className='bg-white shadow-2xl rounded-lg max-w-4xl mx-auto p-3 sm:p-4 w-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
                <button 
                    className='w-fit ml-auto text-xl sm:text-2xl text-slate-600 hover:text-red-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors block' 
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <CgClose/>
                </button>

                <div className='flex justify-center items-center p-2 sm:p-4 max-h-[75vh] sm:max-h-[80vh] w-full overflow-hidden'>
                    <img 
                        src={imgUrl} 
                        alt="Product Preview" 
                        className='w-auto h-auto max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain mx-auto rounded'
                    />
                </div>
        </div>

    </div>
  )
}

export default DisplayImage