import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!query?.search) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SummaryApi.searchProduct.url}${query.search}`);
      const dataResponse = await response.json();

      if (dataResponse?.success) {
        setData(dataResponse?.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Fetch Search Product Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [query.search]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div className='container mx-auto p-4 max-w-7xl min-h-[calc(100vh-120px)]'>
      
      {/* Search Header Count */}
      <div className='my-3 flex items-center justify-between'>
        <h2 className='text-lg sm:text-xl font-bold text-slate-800'>
          Search Results: <span className='text-red-600'>{data.length}</span>
        </h2>
      </div>

      {/* Loading Skeleton Indicator */}
      {loading && (
        <div className='flex items-center justify-center py-12'>
          <div className='flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100'>
            <div className='w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
            <span className='text-slate-600 font-medium text-sm'>Searching products...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className='bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-slate-100 my-4 max-w-md mx-auto'>
          <p className='text-slate-700 text-base sm:text-lg font-semibold mb-1'>No Products Found</p>
          <p className='text-slate-400 text-xs sm:text-sm'>Try checking for spelling errors or searching for a different keyword.</p>
        </div>
      )}

      {/* Search Results Display */}
      {!loading && data.length > 0 && (
        <div className='mt-4'>
          <VerticalCard loading={loading} data={data} />
        </div>
      )}

    </div>
  );
};

export default SearchProduct;