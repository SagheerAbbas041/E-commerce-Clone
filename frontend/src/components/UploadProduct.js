import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadImageCloudinary = await uploadImage(file);
      if (uploadImageCloudinary?.url) {
        setData((prev) => ({
          ...prev,
          productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during image upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message);
        onClose();
        if (fetchData) fetchData();
      } else {
        toast.error(responseData?.message || "Failed to upload product.");
      }
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error("Something went wrong while saving the product.");
    }
  };

  return (
    <div className='fixed inset-0 w-full h-full bg-slate-800 bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white p-4 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden'>
        
        {/* Header */}
        <div className='flex justify-between items-center pb-3 border-b border-slate-200'>
          <h2 className='font-bold text-lg text-slate-800'>Upload Product</h2>
          <button 
            type="button" 
            className='text-2xl hover:text-red-600 transition-colors text-slate-600' 
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        {/* Form Container */}
        <form className='grid p-4 gap-3 overflow-y-auto flex-1 text-slate-700' onSubmit={handleSubmit}>
          
          <div>
            <label htmlFor='productName' className='font-medium text-sm'>Product Name :</label>
            <input
              type='text'
              id='productName'
              placeholder='Enter product name'
              name='productName'
              value={data.productName}
              onChange={handleOnChange}
              className='p-2 bg-slate-50 border rounded w-full mt-1 focus:outline-red-600 text-sm'
              required
            />
          </div>

          <div>
            <label htmlFor='brandName' className='font-medium text-sm'>Brand Name :</label>
            <input
              type='text'
              id='brandName'
              placeholder='Enter brand name'
              value={data.brandName}
              name='brandName'
              onChange={handleOnChange}
              className='p-2 bg-slate-50 border rounded w-full mt-1 focus:outline-red-600 text-sm'
              required
            />
          </div>

          <div>
            <label htmlFor='category' className='font-medium text-sm'>Category :</label>
            <select
              required
              value={data.category}
              name='category'
              onChange={handleOnChange}
              className='p-2 bg-slate-50 border rounded w-full mt-1 focus:outline-red-600 text-sm'
            >
              <option value="">Select Category</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>{el.label}</option>
              ))}
            </select>
          </div>

          {/* Product Image Upload Section */}
          <div>
            <label className='font-medium text-sm'>Product Image :</label>
            <label htmlFor='uploadImageInput'>
              <div className='p-2 bg-slate-50 border border-dashed border-slate-300 rounded h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors mt-1'>
                <div className='text-slate-500 flex justify-center items-center flex-col gap-1'>
                  <span className='text-3xl'><FaCloudUploadAlt /></span>
                  <p className='text-xs font-medium'>
                    {uploadingImage ? "Uploading..." : "Click to Upload Product Image"}
                  </p>
                  <input
                    type='file'
                    id='uploadImageInput'
                    className='hidden'
                    disabled={uploadingImage}
                    onChange={handleUploadProduct}
                  />
                </div>
              </div>
            </label>

            {/* Display Uploaded Images */}
            <div className='mt-2'>
              {data.productImage.length > 0 ? (
                <div className='flex items-center gap-3 flex-wrap'>
                  {data.productImage.map((el, index) => (
                    <div className='relative group border rounded p-1 bg-white' key={el + index}>
                      <img
                        src={el}
                        alt={`product-${index}`}
                        width={80}
                        height={80}
                        className='bg-slate-100 object-scale-down h-20 w-20 cursor-pointer rounded'
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(el);
                        }}
                      />
                      <button
                        type="button"
                        aria-label="Delete image"
                        className='absolute bottom-1 right-1 p-1 text-white bg-red-600 rounded-full hidden group-hover:flex items-center justify-center hover:bg-red-700 transition-colors'
                        onClick={() => handleDeleteProductImage(index)}
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-red-600 text-xs mt-1'>* Please upload at least one product image.</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div>
              <label htmlFor='price' className='font-medium text-sm'>Price :</label>
              <input
                type='number'
                id='price'
                placeholder='Enter price'
                value={data.price}
                name='price'
                onChange={handleOnChange}
                className='p-2 bg-slate-50 border rounded w-full mt-1 focus:outline-red-600 text-sm'
                required
              />
            </div>

            <div>
              <label htmlFor='sellingPrice' className='font-medium text-sm'>Selling Price :</label>
              <input
                type='number'
                id='sellingPrice'
                placeholder='Enter selling price'
                value={data.sellingPrice}
                name='sellingPrice'
                onChange={handleOnChange}
                className='p-2 bg-slate-50 border rounded w-full mt-1 focus:outline-red-600 text-sm'
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor='description' className='font-medium text-sm'>Description :</label>
            <textarea
              id='description'
              className='h-24 bg-slate-50 border resize-none p-2 rounded w-full mt-1 focus:outline-red-600 text-sm'
              placeholder='Enter product description'
              rows={3}
              onChange={handleOnChange}
              name='description'
              value={data.description}
            />
          </div>

          <button className='px-3 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors my-2 active:scale-98'>
            Upload Product
          </button>
        </form>
      </div>

      {/* Full Screen Image Modal */}
      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  );
};

export default UploadProduct;