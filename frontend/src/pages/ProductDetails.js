import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });
  
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          productId: params?.id
        })
      });

      const dataResponse = await response.json();
      if (dataResponse?.success) {
        setData(dataResponse?.data || {});
        setActiveImage(dataResponse?.data?.productImage?.[0] || "");
      }
    } catch (error) {
      console.error("Fetch Product Details Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchProductDetails();
    }
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className='container mx-auto p-4 max-w-7xl min-h-[calc(100vh-120px)]'>

      <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100'>
        
        {/* Product Image Section */}
        <div className='flex flex-col-reverse lg:flex-row gap-4 shrink-0'>

          {/* Thumbnail Strip */}
          <div className='h-full'>
            {loading ? (
              <div className='flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-none h-20 lg:h-96'>
                {productImageListLoading.map((_, index) => (
                  <div className='h-16 w-16 sm:h-20 sm:w-20 bg-slate-200 rounded-xl animate-pulse shrink-0' key={"loadingImage" + index} />
                ))}
              </div>
            ) : (
              <div className='flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-none h-20 lg:h-96 pr-1'>
                {data?.productImage?.map((imgURL) => (
                  <div 
                    className={`h-16 w-16 sm:h-20 sm:w-20 bg-slate-50 rounded-xl p-1.5 border transition-all cursor-pointer shrink-0 ${
                      activeImage === imgURL ? 'border-red-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`} 
                    key={imgURL}
                    onClick={() => handleMouseEnterProduct(imgURL)}
                    onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                  >
                    <img src={imgURL} alt="Product thumbnail" className='w-full h-full object-contain mix-blend-multiply' />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Display Image */}
          <div className='h-[300px] w-full sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px] bg-slate-50 rounded-2xl relative p-4 border border-slate-100 flex items-center justify-center overflow-hidden'>
            {loading ? (
              <div className='w-full h-full bg-slate-200 rounded-xl animate-pulse' />
            ) : (
              <img 
                src={activeImage} 
                alt={data?.productName}
                className='h-full w-full object-contain mix-blend-multiply cursor-crosshair' 
                onMouseMove={handleZoomImage} 
                onMouseLeave={handleLeaveImageZoom}
              />
            )}

            {/* Desktop Hover Image Zoom */}
            {zoomImage && !loading && (
              <div className='hidden lg:block absolute min-w-[500px] min-h-[420px] bg-white p-2 border border-slate-200 shadow-xl rounded-2xl z-30 -right-[520px] top-0 overflow-hidden pointer-events-none'>
                <div
                  className='w-full h-full min-h-[400px] min-w-[480px] mix-blend-multiply scale-150 rounded-xl'
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                    backgroundSize: '200%'
                  }}
                />
              </div>
            )}
          </div>

        </div>

        {/* Product Details Section */}
        {loading ? (
          <div className='flex flex-col gap-3 w-full animate-pulse mt-2'>
            <div className='h-6 bg-slate-200 rounded-full w-28' />
            <div className='h-8 bg-slate-200 rounded-lg w-3/4' />
            <div className='h-5 bg-slate-200 rounded-md w-32' />
            <div className='h-5 bg-slate-200 rounded-md w-24' />
            <div className='h-8 bg-slate-200 rounded-lg w-1/2 my-2' />
            <div className='flex gap-3 my-2'>
              <div className='h-10 bg-slate-200 rounded-xl w-32' />
              <div className='h-10 bg-slate-200 rounded-xl w-32' />
            </div>
            <div className='h-4 bg-slate-200 rounded w-20 mt-2' />
            <div className='h-20 bg-slate-200 rounded-xl w-full' />
          </div>
        ) : (
          <div className='flex flex-col gap-2.5 flex-1'>
            <span className='bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold w-fit tracking-wide'>
              {data?.brandName || "Brand"}
            </span>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 leading-snug'>{data?.productName}</h1>
            <p className='capitalize text-xs sm:text-sm text-slate-400 font-medium'>{data?.category}</p>

            {/* Ratings */}
            <div className='text-amber-500 flex items-center gap-1 text-sm sm:text-base my-0.5'>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              <span className='text-slate-400 text-xs ml-1 font-medium'>(4.5 ratings)</span>
            </div>

            {/* Price */}
            <div className='flex items-center gap-3 text-2xl lg:text-3xl font-bold my-1'>
              <span className='text-red-600'>{displayINRCurrency(data?.sellingPrice)}</span>
              {data?.price && (
                <span className='text-slate-400 line-through text-lg lg:text-xl font-normal'>
                  {displayINRCurrency(data?.price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-3 my-3'>
              <button 
                className='border-2 border-red-600 rounded-xl px-5 py-2.5 min-w-[130px] text-red-600 font-bold text-xs sm:text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95' 
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy Now
              </button>
              <button 
                className='border-2 border-red-600 rounded-xl px-5 py-2.5 min-w-[130px] font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 hover:border-red-700 transition-all shadow-sm active:scale-95' 
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>

            {/* Description */}
            <div className='border-t border-slate-100 pt-3 mt-1'>
              <p className='text-slate-700 font-semibold text-xs sm:text-sm mb-1'>Description:</p>
              <p className='text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line'>{data?.description}</p>
            </div>
          </div>
        )}

      </div>

      {/* Recommended Products */}
      {data?.category && (
        <div className='mt-8'>
          <CategoryWiseProductDisplay category={data?.category} heading={"Recommended Products"} />
        </div>
      )}

    </div>
  );
};

export default ProductDetails;