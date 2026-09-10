import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct,setCategoryProduct] = useState([])
    const [loading,setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async() =>{
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(()=>{
        fetchCategoryProduct()
    },[])

  return (
    <div className='container mx-auto p-2 sm:p-4'>
           <div className='flex items-center gap-3 sm:gap-4 md:gap-6 justify-between overflow-x-auto scrollbar-none py-2 px-1'>
            {

                loading ? (
                    categoryLoading.map((el,index)=>{
                            return(
                                <div className='flex flex-col items-center gap-1.5 flex-shrink-0' key={"categoryLoading"+index}>
                                    <div className='h-14 w-14 sm:h-16 sm:w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'>
                                    </div>
                                    <div className='h-3 w-12 sm:w-14 bg-slate-200 animate-pulse rounded'></div>
                                </div>
                            )
                    })  
                ) :
                (
                    categoryProduct.map((product,index)=>{
                        return(
                            <Link to={"/product-category?category="+product?.category} className='cursor-pointer flex-shrink-0 group' key={product?.category}>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-2.5 sm:p-3 md:p-4 bg-slate-200 flex items-center justify-center transition-all group-hover:shadow-md'>
                                    <img src={product?.productImage[0]} alt={product?.category} className='h-full w-full object-scale-down mix-blend-multiply group-hover:scale-125 transition-all'/>
                                </div>
                                <p className='text-center text-xs sm:text-sm md:text-base capitalize font-medium text-slate-700 group-hover:text-red-600 transition-colors mt-1.5 line-clamp-1 max-w-[70px] sm:max-w-[90px] mx-auto'>
                                  {product?.category}
                                </p>
                            </Link>
                        )
                    })
                )
            }
           </div>
    </div>
  )
}

export default CategoryList