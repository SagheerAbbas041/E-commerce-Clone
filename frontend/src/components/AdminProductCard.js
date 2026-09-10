import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)

  return (
    <div className='bg-white p-3 sm:p-4 rounded shadow-sm hover:shadow-md transition-all w-full max-w-[200px] sm:max-w-[220px] mx-auto border border-slate-100 flex flex-col justify-between'>
       <div className='w-full flex flex-col items-center'>
            <div className='w-28 h-28 sm:w-32 sm:h-32 flex justify-center items-center bg-slate-50 rounded p-2 overflow-hidden'>
              <img src={data?.productImage[0]} alt={data?.productName} className='mx-auto object-scale-down h-full w-full hover:scale-105 transition-all'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2 text-xs sm:text-sm md:text-base font-medium text-slate-800 text-center mt-2 h-8 sm:h-10 w-full' title={data?.productName}>
              {data.productName}
            </h1>

            <div className='w-full flex items-center justify-between mt-2 pt-2 border-t border-slate-100'>

                <p className='font-semibold text-xs sm:text-sm text-slate-900'>
                  {
                    displayINRCurrency(data.sellingPrice)
                  }
                </p>

                <div className='w-fit p-1.5 sm:p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer text-xs sm:text-sm transition-colors' onClick={()=>setEditProduct(true)}>
                    <MdModeEditOutline/>
                </div>

            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminProductCard