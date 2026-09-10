import React, { useEffect, useState } from 'react'
import image1 from '../assest/banner/img1.webp'
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/img3.jpg'
import image4 from '../assest/banner/img4.jpg'
import image5 from '../assest/banner/img5.webp'

import image1Mobile from '../assest/banner/img1_mobile.jpg'
import image2Mobile from '../assest/banner/img2_mobile.webp'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/img5_mobile.png'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () =>{
        if(desktopImages.length - 1 > currentImage){
            setCurrentImage(preve => preve + 1)
        }
    }

    const preveImage = () =>{
        if(currentImage !== 0){
            setCurrentImage(preve => preve - 1)
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(desktopImages.length - 1 > currentImage){
                nextImage()
            }else{
                setCurrentImage(0)
            }
        },5000)

        return ()=> clearInterval(interval)
    },[currentImage])

  return (
    <div className='container mx-auto px-2 sm:px-4 rounded overflow-hidden'>
        <div className='h-44 sm:h-60 md:h-72 lg:h-96 w-full bg-slate-200 relative rounded-lg overflow-hidden shadow-sm'>

                {/** Navigation Buttons for Tablet and Desktop */}
                <div className='absolute z-10 h-full w-full md:flex items-center justify-between px-2 lg:px-4 hidden pointer-events-none'>
                    <button onClick={preveImage} className='bg-white/80 hover:bg-white text-slate-800 shadow-md rounded-full p-2 text-xl lg:text-2xl transition-all pointer-events-auto hover:scale-110 active:scale-95'>
                        <FaAngleLeft/>
                    </button>
                    <button onClick={nextImage} className='bg-white/80 hover:bg-white text-slate-800 shadow-md rounded-full p-2 text-xl lg:text-2xl transition-all pointer-events-auto hover:scale-110 active:scale-95'>
                        <FaAngleRight/>
                    </button> 
                </div>

                {/** Navigation Dots Indicator (Mobile & Touch Friendly) */}
                <div className='absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2'>
                    {desktopImages.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentImage(index)}
                            className={`h-1.5 sm:h-2 rounded-full transition-all ${currentImage === index ? 'w-5 sm:w-6 bg-red-600' : 'w-1.5 sm:w-2 bg-white/70'}`}
                        />
                    ))}
                </div>

                {/** Desktop & Tablet Version */}
              <div className='hidden md:flex h-full w-full overflow-hidden'>
                {
                        desktopImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all duration-500 ease-in-out' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} alt={`banner-${index}`} className='w-full h-full object-cover object-center'/>
                            </div>
                            )
                        })
                }
              </div>

                {/** Mobile Version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                {
                        mobileImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all duration-500 ease-in-out' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} alt={`banner-mobile-${index}`} className='w-full h-full object-cover object-center'/>
                            </div>
                            )
                        })
                }
              </div>

        </div>
    </div>
  )
}

export default BannerProduct