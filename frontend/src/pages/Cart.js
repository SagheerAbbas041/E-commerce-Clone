import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { MdDeleteOutline, MdShoppingCart } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("PKR");

    const currencySymbols = {
        PKR: "Rs",
        USD: "$",
        EUR: "€",
        GBP: "£",
        AED: "AED",
        SAR: "SR"
    };

    // Fetch Cart Products
    const fetchCartData = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
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
            console.error("Fetch cart error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // Quantity Handlers (Optimistic UI / Backend Integration)
    const handleIncreaseQty = (id) => {
        setData(prev => prev.map(item => 
            item._id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        ));
    };

    const handleDecreaseQty = (id) => {
        setData(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = (item.quantity || 1) - 1;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const handleRemoveItem = (id) => {
        setData(prev => prev.filter(item => item._id !== id));
    };

    // Calculation Totals
    const totalQty = data.reduce((acc, curr) => acc + (curr?.quantity || 1), 0);
    const totalPrice = data.reduce((acc, curr) => {
        const price = curr?.productId?.sellingPrice || curr?.productId?.price || curr?.price || 0;
        return acc + (price * (curr?.quantity || 1));
    }, 0);

    const handlePayment = async () => {
        if (!data || data.length === 0) {
            alert("Your cart is empty! Please add products before checking out.");
            return;
        }

        try {
            const res = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({ 
                    cartItems: data,
                    currency: selectedCurrency
                })
            });

            const responseData = await res.json();

            if (responseData.success && responseData?.url) {
                window.location.href = responseData.url;
            } else {
                alert(`Payment initiation failed: ${responseData?.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Payment Exception:", error);
            alert("Something went wrong with the payment process.");
        }
    };

    return (
        <div className='container mx-auto px-3 sm:px-6 py-4 max-w-6xl min-h-[calc(100vh-120px)]'>
            <h1 className='text-lg sm:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2'>
                <MdShoppingCart className='text-red-600' />
                <span>Shopping Cart</span>
                <span className='text-xs sm:text-sm font-normal text-slate-500'>({totalQty} items)</span>
            </h1>

            {/* Currency Selector Bar */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 mb-6 gap-2'>
                <label className='font-medium text-xs sm:text-sm text-slate-700'>
                    Preferred Payment Currency:
                </label>
                <select 
                    value={selectedCurrency} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className='w-full sm:w-auto px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-xs sm:text-sm font-medium outline-none focus:border-red-600 transition-colors'
                >
                    <option value="PKR">PKR - Pakistani Rupee (Rs)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="AED">AED - UAE Dirham (AED)</option>
                    <option value="SAR">SAR - Saudi Riyal (SR)</option>
                </select>
            </div>

            {loading ? (
                /* Skeleton Loader */
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 space-y-3'>
                        {new Array(3).fill(null).map((_, i) => (
                            <div key={`cart-skel-${i}`} className='bg-white p-4 rounded-xl border border-slate-100 animate-pulse flex gap-4'>
                                <div className='w-20 h-20 bg-slate-200 rounded-lg' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-slate-200 rounded w-1/2' />
                                    <div className='h-3 bg-slate-200 rounded w-1/4' />
                                    <div className='h-6 bg-slate-200 rounded w-1/3' />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='bg-white p-4 rounded-xl border border-slate-100 h-48 animate-pulse' />
                </div>
            ) : data.length > 0 ? (
                /* Main Cart Grid */
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                    
                    {/* Item List Section */}
                    <div className='lg:col-span-2 space-y-3'>
                        {data.map((item, index) => {
                            const product = item?.productId || item;
                            const price = product?.sellingPrice || product?.price || 0;
                            const qty = item?.quantity || 1;

                            return (
                                <div 
                                    key={item?._id || index} 
                                    className='bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm flex flex-row items-center gap-3 sm:gap-4 hover:border-slate-200 transition-colors'
                                >
                                    {/* Product Image */}
                                    <div className='w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-lg p-2 flex-shrink-0 flex items-center justify-center border border-slate-100'>
                                        <img 
                                            src={product?.productImage?.[0] || product?.image} 
                                            alt={product?.productName || "Product"} 
                                            className='max-h-full max-w-full object-scale-down'
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className='flex-1 min-w-0 flex flex-col justify-between h-full'>
                                        <div className='flex justify-between items-start gap-2'>
                                            <div>
                                                <p className='text-xs text-slate-400 capitalize'>{product?.category}</p>
                                                <h3 className='font-semibold text-xs sm:text-base text-slate-800 line-clamp-1'>
                                                    {product?.productName || "Product Name"}
                                                </h3>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveItem(item?._id)}
                                                className='text-slate-400 hover:text-red-600 p-1 transition-colors'
                                                title="Remove Item"
                                            >
                                                <MdDeleteOutline size={20} />
                                            </button>
                                        </div>

                                        <div className='flex justify-between items-end mt-2'>
                                            {/* Price */}
                                            <p className='font-bold text-xs sm:text-sm text-slate-800'>
                                                {currencySymbols[selectedCurrency]} {(price * qty).toLocaleString()}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50'>
                                                <button 
                                                    onClick={() => handleDecreaseQty(item?._id)}
                                                    className='px-2 py-0.5 sm:px-2.5 sm:py-1 text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors'
                                                >
                                                    -
                                                </button>
                                                <span className='px-2 text-xs sm:text-sm font-medium text-slate-700 min-w-[24px] text-center'>
                                                    {qty}
                                                </span>
                                                <button 
                                                    onClick={() => handleIncreaseQty(item?._id)}
                                                    className='px-2 py-0.5 sm:px-2.5 sm:py-1 text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors'
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className='bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm sticky top-20'>
                        <h2 className='text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4'>
                            Order Summary
                        </h2>

                        <div className='space-y-2.5 text-xs sm:text-sm text-slate-600 mb-4'>
                            <div className='flex justify-between'>
                                <span>Total Items:</span>
                                <span className='font-semibold text-slate-800'>{totalQty}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Subtotal:</span>
                                <span className='font-semibold text-slate-800'>
                                    {currencySymbols[selectedCurrency]} {totalPrice.toLocaleString()}
                                </span>
                            </div>
                            <div className='flex justify-between text-slate-400'>
                                <span>Shipping:</span>
                                <span className='text-xs italic'>Calculated at checkout</span>
                            </div>
                        </div>

                        <div className='border-t border-slate-100 pt-3 mb-6 flex justify-between items-center'>
                            <span className='font-bold text-sm sm:text-base text-slate-800'>Total Amount:</span>
                            <span className='font-extrabold text-base sm:text-lg text-red-600'>
                                {currencySymbols[selectedCurrency]} {totalPrice.toLocaleString()}
                            </span>
                        </div>

                        <button 
                            onClick={handlePayment} 
                            disabled={data.length === 0 || loading}
                            className={`w-full font-bold py-3 rounded-full transition-all text-xs sm:text-sm shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                                data.length === 0 || loading 
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            Checkout ({selectedCurrency})
                        </button>
                    </div>

                </div>
            ) : (
                /* Empty Cart UI */
                <div className='bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center flex flex-col items-center justify-center my-6'>
                    <div className='bg-red-50 text-red-500 p-4 rounded-full mb-3'>
                        <MdShoppingCart size={48} />
                    </div>
                    <h2 className='text-base sm:text-xl font-bold text-slate-800 mb-1'>Your cart is empty</h2>
                    <p className='text-xs sm:text-sm text-slate-500 mb-6 max-w-sm'>
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link 
                        to="/" 
                        className='bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm active:scale-95'
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;