import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const VerticalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(8).fill(null)

    const scrollElement = useRef(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        e.stopPropagation()
        e.preventDefault()
        await addToCart(e, id)
        if (fetchUserAddToCart) {
            fetchUserAddToCart()
        }
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data || [])
    }

    useEffect(() => {
        fetchData()
    }, [category])

    const scrollRight = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    const scrollLeft = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    return (
        <div className='container mx-auto px-4 my-6 relative group'>
            {/* Heading Responsive */}
            <h2 className='text-lg sm:text-xl md:text-2xl font-semibold py-2 sm:py-4 text-slate-800'>
                {heading}
            </h2>

            <div className='relative flex items-center'>
                {/* Scroll Buttons - Desktop & Tablet Par Visible */}
                <button
                    aria-label="Scroll Left"
                    className='bg-white/90 hover:bg-white shadow-md rounded-full p-2.5 absolute -left-3 z-10 text-slate-700 hidden md:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 hover:scale-110 active:scale-95'
                    onClick={scrollLeft}
                >
                    <FaAngleLeft className='text-lg' />
                </button>

                <button
                    aria-label="Scroll Right"
                    className='bg-white/90 hover:bg-white shadow-md rounded-full p-2.5 absolute -right-3 z-10 text-slate-700 hidden md:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 hover:scale-110 active:scale-95'
                    onClick={scrollRight}
                >
                    <FaAngleRight className='text-lg' />
                </button>

                {/* Horizontal Scroll Container */}
                <div
                    className='flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth transition-all py-2 w-full'
                    ref={scrollElement}
                >
                    {loading ? (
                        loadingList.map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className='w-full min-w-[220px] sm:min-w-[260px] md:min-w-[300px] max-w-[220px] sm:max-w-[260px] md:max-w-[300px] bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden flex-shrink-0'
                            >
                                <div className='bg-slate-200 h-40 sm:h-48 p-4 flex justify-center items-center animate-pulse' />
                                <div className='p-3 sm:p-4 grid gap-2 sm:gap-3'>
                                    <div className='h-4 bg-slate-200 animate-pulse rounded-full w-full' />
                                    <div className='h-3 bg-slate-200 animate-pulse rounded-full w-1/2' />
                                    <div className='flex gap-2 sm:gap-3'>
                                        <div className='h-3 bg-slate-200 animate-pulse rounded-full w-full' />
                                        <div className='h-3 bg-slate-200 animate-pulse rounded-full w-full' />
                                    </div>
                                    <div className='h-8 bg-slate-200 animate-pulse rounded-full w-full mt-1' />
                                </div>
                            </div>
                        ))
                    ) : (
                        data?.map((product, index) => (
                            <Link
                                key={product?._id || index}
                                to={`/product/${product?._id}`}
                                className='w-full min-w-[220px] sm:min-w-[260px] md:min-w-[300px] max-w-[220px] sm:max-w-[260px] md:max-w-[300px] bg-white rounded-md shadow-sm hover:shadow-md border border-slate-100 transition-all overflow-hidden flex-shrink-0 group/card'
                            >
                                <div className='bg-slate-100 h-40 sm:h-48 p-3 sm:p-4 flex justify-center items-center overflow-hidden'>
                                    <img
                                        src={product?.productImage?.[0] || '/placeholder.png'}
                                        alt={product?.productName}
                                        className='object-scale-down h-full w-full group-hover/card:scale-105 transition-transform duration-300 mix-blend-multiply'
                                    />
                                </div>
                                <div className='p-3 sm:p-4 grid gap-1.5 sm:gap-2'>
                                    <h3 className='font-medium text-sm sm:text-base text-slate-800 text-ellipsis line-clamp-1'>
                                        {product?.productName}
                                    </h3>
                                    <p className='capitalize text-xs text-slate-500'>
                                        {product?.category}
                                    </p>
                                    <div className='flex items-center gap-2 mt-0.5 sm:mt-1'>
                                        <p className='text-red-600 font-semibold text-xs sm:text-sm'>
                                            {displayINRCurrency(product?.sellingPrice)}
                                        </p>
                                        {product?.price > product?.sellingPrice && (
                                            <p className='text-slate-400 line-through text-[10px] sm:text-xs'>
                                                {displayINRCurrency(product?.price)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        className='text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:py-2 rounded-full font-medium transition-colors active:scale-95 shadow-sm mt-1 sm:mt-2'
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerticalCardProduct