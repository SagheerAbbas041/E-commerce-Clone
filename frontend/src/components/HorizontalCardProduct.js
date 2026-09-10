import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const scrollElement = useRef(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    await addToCart(e, id);
    if (fetchUserAddToCart) {
      fetchUserAddToCart();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-xl sm:text-2xl font-semibold py-4 text-slate-800'>{heading}</h2>

      <div className='relative flex items-center group'>
        {/* Navigation Scroll Buttons */}
        <button
          className='bg-white shadow-lg rounded-full p-2 absolute -left-2 sm:left-0 z-10 text-lg hidden md:flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-200 text-slate-700'
          onClick={scrollLeft}
          aria-label="Scroll Left"
        >
          <FaAngleLeft />
        </button>

        <button
          className='bg-white shadow-lg rounded-full p-2 absolute -right-2 sm:right-0 z-10 text-lg hidden md:flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-200 text-slate-700'
          onClick={scrollRight}
          aria-label="Scroll Right"
        >
          <FaAngleRight />
        </button>

        {/* Product Cards Track */}
        <div
          className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none scroll-smooth transition-all py-2 w-full'
          ref={scrollElement}
        >
          {loading ? (
            loadingList.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-md shadow-sm border border-slate-100 flex overflow-hidden'
              >
                <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse' />
                <div className='p-3 grid w-full gap-2'>
                  <div className='h-4 bg-slate-200 animate-pulse rounded-full w-full' />
                  <div className='h-3 bg-slate-200 animate-pulse rounded-full w-1/2' />
                  <div className='flex gap-2 w-full mt-1'>
                    <div className='h-3 bg-slate-200 animate-pulse rounded-full w-1/2' />
                    <div className='h-3 bg-slate-200 animate-pulse rounded-full w-1/2' />
                  </div>
                  <div className='h-7 bg-slate-200 animate-pulse rounded-full w-full mt-auto' />
                </div>
              </div>
            ))
          ) : (
            data?.map((product) => (
              <Link
                key={product?._id}
                to={`/product/${product?._id}`}
                className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-md shadow-sm hover:shadow-md border border-slate-100 flex transition-all overflow-hidden group/card'
              >
                <div className='bg-slate-100 h-full p-2 min-w-[120px] md:min-w-[145px] flex items-center justify-center overflow-hidden'>
                  <img
                    src={product?.productImage?.[0] || '/placeholder.png'}
                    alt={product?.productName}
                    className='object-scale-down h-full w-full mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300'
                  />
                </div>
                <div className='p-3 grid flex-1 justify-between'>
                  <div>
                    <h3 className='font-medium text-sm md:text-base text-slate-800 text-ellipsis line-clamp-1'>
                      {product?.productName}
                    </h3>
                    <p className='capitalize text-xs text-slate-500 mt-0.5'>{product?.category}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <p className='text-red-600 font-semibold text-xs sm:text-sm'>
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    {product?.price > product?.sellingPrice && (
                      <p className='text-slate-400 line-through text-[11px] sm:text-xs'>
                        {displayINRCurrency(product?.price)}
                      </p>
                    )}
                  </div>

                  <button
                    className='text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full font-medium transition-colors active:scale-95 shadow-sm mt-1'
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
  );
};

export default HorizontalCardProduct;