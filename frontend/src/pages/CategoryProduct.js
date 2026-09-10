import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'
import { BiFilterAlt } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showMobileFilter, setShowMobileFilter] = useState(false)
    const location = useLocation()
    
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true
    })

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList, setFilterCategoryList] = useState([])
    const [sortBy, setSortBy] = useState("")

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await fetch(SummaryApi.filterProduct.url, {
                method: SummaryApi.filterProduct.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    category: filterCategoryList
                })
            })

            const dataResponse = await response.json()
            let fetchedProducts = dataResponse?.data || []

            // Re-apply sorting on newly fetched data
            if (sortBy === 'asc') {
                fetchedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice)
            } else if (sortBy === 'dsc') {
                fetchedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice)
            }

            setData(fetchedProducts)
        } catch (error) {
            console.error("Failed to fetch category products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectCategory = (e) => {
        const { value, checked } = e.target

        setSelectCategory((prev) => ({
            ...prev,
            [value]: checked
        }))
    }

    useEffect(() => {
        fetchData()
    }, [filterCategoryList])

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory)
            .map(categoryKeyName => selectCategory[categoryKeyName] ? categoryKeyName : null)
            .filter(Boolean)

        setFilterCategoryList(arrayOfCategory)

        // URL construction fix
        const params = new URLSearchParams()
        arrayOfCategory.forEach(cat => params.append("category", cat))
        navigate(`/product-category?${params.toString()}`, { replace: true })
    }, [selectCategory])

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target
        setSortBy(value)

        if (value === 'asc') {
            setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
        } else if (value === 'dsc') {
            setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
        }
    }

    // Filter Content Reusable Component
    const FilterSection = () => (
        <div className='flex flex-col gap-4 text-slate-700'>
            {/* Sort by */}
            <div className='border-b border-slate-200 pb-3'>
                <h3 className='text-xs sm:text-sm uppercase font-bold text-slate-500 mb-2'>Sort by</h3>
                <form className='text-xs sm:text-sm flex flex-col gap-2'>
                    <label className='flex items-center gap-3 cursor-pointer hover:text-slate-900'>
                        <input 
                            type='radio' 
                            name='sortBy' 
                            checked={sortBy === 'asc'} 
                            onChange={handleOnChangeSortBy} 
                            value="asc"
                            className='accent-red-600'
                        />
                        <span>Price - Low to High</span>
                    </label>

                    <label className='flex items-center gap-3 cursor-pointer hover:text-slate-900'>
                        <input 
                            type='radio' 
                            name='sortBy' 
                            checked={sortBy === 'dsc'} 
                            onChange={handleOnChangeSortBy} 
                            value="dsc"
                            className='accent-red-600'
                        />
                        <span>Price - High to Low</span>
                    </label>
                </form>
            </div>

            {/* Filter by Category */}
            <div>
                <h3 className='text-xs sm:text-sm uppercase font-bold text-slate-500 mb-2'>Category</h3>
                <form className='text-xs sm:text-sm flex flex-col gap-2.5 max-h-[50vh] sm:max-h-none overflow-y-auto pr-1'>
                    {productCategory?.map((categoryName, index) => (
                        <label key={categoryName?.value || index} className='flex items-center gap-3 cursor-pointer hover:text-slate-900'>
                            <input 
                                type='checkbox' 
                                name="category" 
                                checked={!!selectCategory[categoryName?.value]} 
                                value={categoryName?.value} 
                                id={categoryName?.value} 
                                onChange={handleSelectCategory}
                                className='accent-red-600 rounded'
                            />
                            <span>{categoryName?.label}</span>
                        </label>
                    ))}
                </form>
            </div>
        </div>
    )

    return (
        <div className='container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl'>
            
            {/* Mobile Top Bar (Filter Trigger + Item Count) */}
            <div className='lg:hidden flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mb-3 shadow-sm'>
                <p className='text-xs sm:text-sm font-semibold text-slate-700'>
                    Results: <span className='text-red-600 font-bold'>{data.length}</span>
                </p>
                <button 
                    onClick={() => setShowMobileFilter(true)}
                    className='flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 transition-colors'
                >
                    <BiFilterAlt size={16} />
                    <span>Filter & Sort</span>
                </button>
            </div>

            {/* Mobile Filter Drawer Modal */}
            {showMobileFilter && (
                <div className='fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end transition-opacity'>
                    <div className='bg-white w-[280px] sm:w-[320px] h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200'>
                        <div>
                            <div className='flex items-center justify-between pb-3 border-b border-slate-200 mb-4'>
                                <h2 className='font-bold text-slate-800 text-base flex items-center gap-2'>
                                    <BiFilterAlt />
                                    <span>Filters</span>
                                </h2>
                                <button 
                                    onClick={() => setShowMobileFilter(false)}
                                    className='p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100'
                                >
                                    <IoClose size={22} />
                                </button>
                            </div>
                            <FilterSection />
                        </div>

                        <button 
                            onClick={() => setShowMobileFilter(false)}
                            className='w-full bg-red-600 text-white font-bold py-2.5 rounded-full text-xs sm:text-sm mt-4 active:scale-95 transition-transform'
                        >
                            Apply & View Results ({data.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Main Desktop & Tablet Grid Layout */}
            <div className='grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-4 items-start'>
                
                {/* Desktop Left Sidebar Filter */}
                <div className='hidden lg:block bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none'>
                    <FilterSection />
                </div>

                {/* Right Side Product Grid Display */}
                <div className='bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm min-h-[calc(100vh-140px)]'>
                    <div className='hidden lg:flex justify-between items-center pb-3 mb-3 border-b border-slate-100'>
                        <p className='font-semibold text-slate-800 text-base'>
                            Search Results: <span className='text-red-600 font-bold'>{data.length}</span>
                        </p>
                    </div>

                    {data.length === 0 && !loading ? (
                        <div className='flex flex-col items-center justify-center py-16 text-slate-400'>
                            <p className='text-sm sm:text-base font-medium'>No products match selected filters.</p>
                        </div>
                    ) : (
                        <div className='min-h-[calc(100vh-200px)]'>
                            <VerticalCard data={data} loading={loading}/>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CategoryProduct