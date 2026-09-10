import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({ loading, data = [] }) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        e.stopPropagation()
        e.preventDefault()
        await addToCart(e, id)
        if (fetchUserAddToCart) {
            fetchUserAddToCart()
        }
    }

    return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-center md:justify-between gap-4 md:gap-6 transition-all'>
            {loading ? (
                loadingList.map((_, index) => (
                    <div 
                        key={`skeleton-${index}`} 
                        className='w-full bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden'
                    >
                        <div className='bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse' />
                        <div className='p-4 grid gap-3'>
                            <div className='h-5 bg-slate-200 animate-pulse rounded-full w-full' />
                            <div className='h-4 bg-slate-200 animate-pulse rounded-full w-1/2' />
                            <div className='flex gap-3'>
                                <div className='h-4 bg-slate-200 animate-pulse rounded-full w-full' />
                                <div className='h-4 bg-slate-200 animate-pulse rounded-full w-full' />
                            </div>
                            <div className='h-8 bg-slate-200 animate-pulse rounded-full w-full mt-1' />
                        </div>
                    </div>
                ))
            ) : (
                data?.map((product, index) => (
                    <Link
                        key={product?._id || index}
                        to={"/product/" + product?._id}
                        className='w-full bg-white rounded-md shadow-sm hover:shadow-md border border-slate-100 transition-all overflow-hidden group'
                        onClick={scrollTop}
                    >
                        <div className='bg-slate-100 h-48 p-4 flex justify-center items-center overflow-hidden'>
                            <img
                                src={product?.productImage?.[0] || '/placeholder.png'}
                                alt={product?.productName}
                                className='object-scale-down h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply'
                            />
                        </div>
                        <div className='p-4 grid gap-2'>
                            <h2 className='font-medium text-base text-slate-800 text-ellipsis line-clamp-1'>
                                {product?.productName}
                            </h2>
                            <p className='capitalize text-xs text-slate-500'>
                                {product?.category}
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                                <p className='text-red-600 font-semibold text-sm'>
                                    {displayINRCurrency(product?.sellingPrice)}
                                </p>
                                {product?.price > product?.sellingPrice && (
                                    <p className='text-slate-400 line-through text-xs'>
                                        {displayINRCurrency(product?.price)}
                                    </p>
                                )}
                            </div>
                            <button
                                className='text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full font-medium transition-colors active:scale-95 shadow-sm mt-2'
                                onClick={(e) => handleAddToCart(e, product?._id)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}

export default VerticalCard