import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
  }) => {

  const [data,setData] = useState({
    ...productData,
    productName : productData?.productName,
    brandName : productData?.brandName,
    category : productData?.category,
    productImage : productData?.productImage || [],
    description : productData?.description,
    price : productData?.price,
    sellingPrice : productData?.sellingPrice
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")


  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [ ...preve.productImage, uploadImageCloudinary.url]
      }
    })
  }

  const handleDeleteProductImage = async(index)=>{
    console.log("image index",index)
    
    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
    
  }


  {/**upload product */}
  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    const response = await fetch(SummaryApi.updateProduct.url,{
      method : SummaryApi.updateProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchdata()
    }


    if(responseData.error){
      toast.error(responseData?.message)
    }
  

  }

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 p-2 sm:p-4'>
    <div className='bg-white p-3 sm:p-4 rounded-lg w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-xl'>

         <div className='flex justify-between items-center pb-3 border-b'>
             <h2 className='font-bold text-base sm:text-lg md:text-xl text-slate-800'>Edit Product</h2>
             <div className='w-fit ml-auto text-xl sm:text-2xl hover:text-red-600 cursor-pointer transition-colors p-1' onClick={onClose}>
                 <CgClose/>
             </div>
         </div>

       <form className='grid p-1 sm:p-4 gap-2 overflow-y-auto h-full pb-5' onSubmit={handleSubmit}>
         <label htmlFor='productName' className='text-sm sm:text-base font-medium text-slate-700'>Product Name :</label>
         <input 
           type='text' 
           id='productName' 
           placeholder='enter product name' 
           name='productName'
           value={data.productName} 
           onChange={handleOnChange}
           className='p-2 bg-slate-100 border rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base'
           required
         />


         <label htmlFor='brandName' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Brand Name :</label>
         <input 
           type='text' 
           id='brandName' 
           placeholder='enter brand name' 
           value={data.brandName} 
           name='brandName'
           onChange={handleOnChange}
           className='p-2 bg-slate-100 border rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base'
           required
         />

           <label htmlFor='category' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Category :</label>
           <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base'>
               <option value={""}>Select Category</option>
               {
                 productCategory.map((el,index)=>{
                   return(
                     <option value={el.value} key={el.value+index}>{el.label}</option>
                   )
                 })
               }
           </select>

           <label htmlFor='productImage' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Product Image :</label>
           <label htmlFor='uploadImageInput'>
           <div className='p-2 bg-slate-100 border rounded h-28 sm:h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-200 transition-colors'>
                     <div className='text-slate-500 flex justify-center items-center flex-col gap-1 sm:gap-2'>
                       <span className='text-3xl sm:text-4xl'><FaCloudUploadAlt/></span>
                       <p className='text-xs sm:text-sm text-center'>Upload Product Image</p>
                       <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct}/>
                     </div>
           </div>
           </label> 
           <div>
               {
                 data?.productImage[0] ? (
                     <div className='flex items-center gap-2 flex-wrap max-h-40 overflow-y-auto p-1'>
                         {
                           data.productImage.map((el,index)=>{
                             return(
                               <div className='relative group' key={index}>
                                   <img 
                                     src={el} 
                                     alt={el} 
                                     width={80} 
                                     height={80}  
                                     className='bg-slate-100 border cursor-pointer w-16 h-16 sm:w-20 sm:h-20 object-scale-down rounded'  
                                     onClick={()=>{
                                       setOpenFullScreenImage(true)
                                       setFullScreenImage(el)
                                     }}/>

                                     <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer hover:bg-red-700' onClick={()=>handleDeleteProductImage(index)}>
                                       <MdDelete className='text-xs sm:text-sm'/>  
                                     </div>
                               </div>
                               
                             )
                           })
                         }
                     </div>
                 ) : (
                   <p className='text-red-600 text-xs'>*Please upload product image</p>
                 )
               }
               
           </div>

           <label htmlFor='price' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Price :</label>
           <input 
             type='number' 
             id='price' 
             placeholder='enter price' 
             value={data.price} 
             name='price'
             onChange={handleOnChange}
             className='p-2 bg-slate-100 border rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base'
             required
           />


           <label htmlFor='sellingPrice' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Selling Price :</label>
           <input 
             type='number' 
             id='sellingPrice' 
             placeholder='enter selling price' 
             value={data.sellingPrice} 
             name='sellingPrice'
             onChange={handleOnChange}
             className='p-2 bg-slate-100 border rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base'
             required
           />

           <label htmlFor='description' className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-700'>Description :</label>
           <textarea 
             className='h-24 sm:h-28 bg-slate-100 border resize-none p-2 rounded outline-none focus:bg-white focus:border-red-600 text-sm sm:text-base' 
             placeholder='enter product description' 
             rows={3} 
             onChange={handleOnChange} 
             name='description'
             value={data.description}
           >
           </textarea>

           <button className='px-3 py-2 bg-red-600 text-white my-4 hover:bg-red-700 rounded transition-colors text-sm sm:text-base font-medium w-full sm:w-auto ml-auto'>Update Product</button>
       </form> 

    </div>

    {/***display image full screen */}
    {
     openFullScreenImage && (
       <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
     )
    }
     
 </div>
  )
}

export default AdminEditProduct