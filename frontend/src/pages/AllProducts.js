import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
import { IoAdd } from 'react-icons/io5'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const dataResponse = await response.json()
      setAllProduct(dataResponse?.data || [])
    } catch (error) {
      console.error("Failed to fetch products", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  return (
    <div className='w-full'>
      {/* Header Section */}
      <div className='bg-white py-3 px-3 sm:px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 rounded-t-md'>
        <div>
          <h2 className='font-bold text-base sm:text-lg text-slate-800'>All Products</h2>
          <p className='text-xs text-slate-500'>
            Total Products: <span className='font-semibold text-slate-700'>{allProduct.length}</span>
          </p>
        </div>

        <button 
          className='w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1.5 px-4 rounded-full font-medium text-xs sm:text-sm flex items-center justify-center gap-1 shadow-sm active:scale-95' 
          onClick={() => setOpenUploadProduct(true)}
        >
          <IoAdd className='text-base sm:text-lg' />
          <span>Upload Product</span>
        </button>
      </div>

      {/* Product List Grid */}
      <div className='py-4 px-1 sm:px-2 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-none'>
        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'>
            {new Array(10).fill(null).map((_, index) => (
              <div key={`skeleton-${index}`} className='bg-white p-3 rounded-md shadow-sm border border-slate-100 animate-pulse'>
                <div className='bg-slate-200 h-32 sm:h-36 rounded-md w-full mb-2' />
                <div className='h-4 bg-slate-200 rounded w-3/4 mb-2' />
                <div className='h-3 bg-slate-200 rounded w-1/2' />
              </div>
            ))}
          </div>
        ) : allProduct.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 justify-items-center'>
            {allProduct.map((product, index) => (
              <AdminProductCard 
                data={product} 
                key={product?._id || index} 
                fetchdata={fetchAllProduct}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-slate-400'>
            <p className='text-sm sm:text-base'>No products found.</p>
          </div>
        )}
      </div>

      {/* Upload Product Modal Container */}
      {openUploadProduct && (
        <UploadProduct 
          onClose={() => setOpenUploadProduct(false)} 
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  )
}

export default AllProducts