import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'

const CategroyWiseProductDisplay = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }




    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data",categoryProduct.data)
        setData(categoryProduct?.data)
    }

    useEffect(()=>{
        fetchData()
    },[])




  return (
    <div className='container mx-auto px-2 sm:px-4 my-4 sm:my-6 relative'>

            <h2 className='text-lg sm:text-xl md:text-2xl font-semibold py-2 sm:py-4 text-slate-800'>{heading}</h2>

                
           <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-center transition-all'>
           {

                loading ? (
                    loadingList.map((product,index)=>{
                        return(
                            <div className='w-full bg-white rounded-md shadow border border-slate-100 overflow-hidden' key={"categoryWiseLoading"+index}>
                                <div className='bg-slate-200 h-36 sm:h-44 md:h-48 p-2 sm:p-4 w-full flex justify-center items-center animate-pulse'>
                                </div>
                                <div className='p-2 sm:p-4 grid gap-1.5 sm:gap-3'>
                                    <h2 className='font-medium text-xs sm:text-base text-ellipsis line-clamp-1 p-1 py-1.5 animate-pulse rounded-full bg-slate-200'></h2>
                                    <p className='capitalize p-1 animate-pulse rounded-full bg-slate-200 py-1.5'></p>
                                    <div className='flex gap-1.5 sm:gap-3'>
                                        <p className='p-1 animate-pulse rounded-full bg-slate-200 w-full py-1.5'></p>
                                        <p className='p-1 animate-pulse rounded-full bg-slate-200 w-full py-1.5'></p>
                                    </div>
                                    <button className='px-3 rounded-full bg-slate-200 py-2 sm:py-2.5 animate-pulse w-full mt-1'></button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    data?.map((product,index)=>{
                        return(
                            <Link to={"/product/"+product?._id} className='w-full bg-white rounded-md shadow hover:shadow-md border border-slate-100 overflow-hidden transition-all group' onClick={scrollTop} key={product?._id || index}>
                                <div className='bg-slate-100 h-36 sm:h-44 md:h-48 p-2 sm:p-4 w-full flex justify-center items-center overflow-hidden'>
                                    <img src={product.productImage[0]} alt={product?.productName} className='object-scale-down h-full w-full group-hover:scale-110 transition-all mix-blend-multiply'/>
                                </div>
                                <div className='p-2 sm:p-4 grid gap-1 sm:gap-2'>
                                    <h2 className='font-medium text-xs sm:text-sm md:text-base text-ellipsis line-clamp-1 text-black group-hover:text-red-600 transition-colors' title={product?.productName}>{product?.productName}</h2>
                                    <p className='capitalize text-xs sm:text-sm text-slate-500'>{product?.category}</p>
                                    <div className='flex items-center gap-1.5 sm:gap-3 flex-wrap'>
                                        <p className='text-red-600 font-semibold text-xs sm:text-sm md:text-base'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                        <p className='text-slate-400 line-through text-[10px] sm:text-xs md:text-sm'>{ displayINRCurrency(product?.price)  }</p>
                                    </div>
                                    <button className='text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mt-1 transition-colors' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                                </div>
                            </Link>
                        )
                    })
                )
                
            }
           </div>
            

    </div>
  )
}

export default CategroyWiseProductDisplay