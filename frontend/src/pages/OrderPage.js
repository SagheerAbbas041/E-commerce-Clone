import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';

const OrderPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.orderList.url, {
                method: SummaryApi.orderList.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                }
            });

            const responseData = await response.json();

            if (responseData.success) {
                setData(responseData.data || []);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    // 1. Calculate Grand Total of ALL Orders
    const grandTotal = data.reduce((acc, currentOrder) => {
        return acc + (currentOrder?.totalAmount || 0);
    }, 0);

    // 2. Calculate Total Quantity of ALL Purchased Products
    const totalItemsCount = data.reduce((acc, currentOrder) => {
        const orderItemsCount = currentOrder?.productDetails?.reduce((pAcc, product) => {
            return pAcc + (product?.quantity || 1);
        }, 0) || 0;
        return acc + orderItemsCount;
    }, 0);

    return (
        <div className='container mx-auto p-4 max-w-5xl min-h-[calc(100vh-120px)]'>
            
            {/* Loading Skeleton */}
            {loading && (
                <div className='flex flex-col gap-4 animate-pulse'>
                    <div className='h-28 bg-slate-200 rounded-xl w-full'></div>
                    <div className='h-40 bg-slate-200 rounded-xl w-full'></div>
                    <div className='h-40 bg-slate-200 rounded-xl w-full'></div>
                </div>
            )}

            {/* No Orders Found */}
            {!loading && data.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 text-center p-6'>
                    <div className='w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-2xl font-bold mb-3'>
                        🛒
                    </div>
                    <h3 className='text-lg font-bold text-slate-800 mb-1'>No Orders Found</h3>
                    <p className='text-slate-500 text-sm'>You haven't placed any orders yet.</p>
                </div>
            )}

            {/* Purchase Summary Banner */}
            {!loading && data.length > 0 && (
                <>
                    <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-5 sm:p-6 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                        <div>
                            <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>Purchase Summary</h1>
                            <p className='text-red-100 text-xs sm:text-sm mt-1'>
                                Total Orders Placed: <span className='font-semibold text-white'>{data.length}</span> | Total Items: <span className='font-semibold text-white'>{totalItemsCount}</span>
                            </p>
                        </div>
                        <div className='bg-white text-slate-800 px-5 py-2.5 rounded-xl shadow-sm font-bold w-full md:w-auto flex items-center justify-between md:justify-start gap-3'>
                            <span className='text-slate-500 text-xs sm:text-sm uppercase tracking-wide'>Grand Total:</span>
                            <span className='text-green-600 text-xl sm:text-2xl font-extrabold'>{displayINRCurrency(grandTotal)}</span>
                        </div>
                    </div>

                    <h2 className='text-lg sm:text-xl font-bold mb-4 text-slate-800'>Order History</h2>
                </>
            )}

            {/* Individual Order Cards */}
            {!loading && data.length > 0 && (
                <div className='flex flex-col gap-5'>
                    {data.map((item, index) => {
                        const orderDate = item?.createdAt ? new Date(item.createdAt) : null;
                        const formattedDate = orderDate 
                            ? `${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : "N/A";

                        return (
                            <div key={item._id || index} className='border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden'>
                                
                                {/* Order Header */}
                                <div className='flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 mb-4 gap-2'>
                                    <div>
                                        <p className='font-bold text-sm sm:text-base text-slate-800'>
                                            Order #{data.length - index}
                                        </p>
                                        <p className='text-xs text-slate-500 mt-0.5'>
                                            Date: {formattedDate}
                                        </p>
                                    </div>
                                    <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider'>
                                        {item?.paymentDetails?.payment_status || "Paid"}
                                    </span>
                                </div>

                                {/* Product List */}
                                <div className='flex flex-col gap-3'>
                                    {item.productDetails?.map((product, pIndex) => {
                                        const productName = product?.name || product?.productId?.productName || "Product";
                                        const productImage = product?.image || (product?.productId?.productImage ? product?.productId?.productImage[0] : "");
                                        const productPrice = product?.price || product?.productId?.sellingPrice || 0;
                                        const productQty = product?.quantity || 1;

                                        return (
                                            <div key={pIndex + "order-product"} className='flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-3 last:border-none last:pb-0'>
                                                <div className='w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden'>
                                                    {productImage ? (
                                                        <img 
                                                            src={productImage} 
                                                            alt={productName}
                                                            className='w-full h-full object-contain mix-blend-multiply' 
                                                        />
                                                    ) : (
                                                        <span className='text-xs text-slate-400'>No Image</span>
                                                    )}
                                                </div>

                                                <div className='flex flex-col gap-1 flex-1 min-w-0'>
                                                    <p className='font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2'>{productName}</p>
                                                    <div className='flex justify-between items-center text-xs sm:text-sm text-slate-500 mt-1'>
                                                        <p>Qty: <span className='font-medium text-slate-700'>{productQty}</span></p>
                                                        <p className='text-red-600 font-bold text-sm sm:text-base'>
                                                            {displayINRCurrency(productPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Bottom Summary */}
                                <div className='flex justify-between items-center mt-4 pt-3 border-t border-slate-100 bg-slate-50 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 font-bold text-sm sm:text-base'>
                                    <span className='text-slate-600'>Order Total:</span>
                                    <span className='text-green-600 text-base sm:text-lg font-extrabold'>
                                        {displayINRCurrency(item.totalAmount || 0)}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderPage;