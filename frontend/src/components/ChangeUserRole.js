import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const updateUserRole = async() =>{
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                userId : userId,
                role : userRole
            })
        })

        const responseData = await fetchResponse.json()

        if(responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log("role updated",responseData)

    }

  return (
    <div className='fixed inset-0 w-full h-full z-50 flex justify-center items-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 transition-all'>
       <div className='bg-white shadow-xl rounded-lg p-5 sm:p-6 w-full max-w-sm sm:max-w-md relative animate-in fade-in zoom-in-95 duration-200'>

            <button className='absolute top-4 right-4 text-slate-500 hover:text-red-600 text-xl transition-colors p-1 rounded-full hover:bg-slate-100' onClick={onClose}>
                <IoMdClose/>
            </button>

            <h1 className='pb-3 text-base sm:text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-100 pr-8'>
                Change User Role
            </h1>

            <div className='my-4 space-y-2 text-xs sm:text-sm text-slate-600'>
                <p className='break-all'><span className='font-medium text-slate-800'>Name :</span> {name}</p>   
                <p className='break-all'><span className='font-medium text-slate-800'>Email :</span> {email}</p> 
            </div>

            <div className='flex items-center justify-between gap-4 my-5 bg-slate-50 p-3 rounded-md border border-slate-200'>
                <label htmlFor='userRoleSelect' className='text-xs sm:text-sm font-medium text-slate-700'>
                    Role :
                </label>  
                <select 
                    id='userRoleSelect'
                    className='border border-slate-300 rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-medium cursor-pointer' 
                    value={userRole} 
                    onChange={handleOnChangeSelect}
                >
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>

            <div className='flex justify-end gap-3 mt-6 pt-2 border-t border-slate-100'>
                <button 
                    className='py-1.5 px-4 rounded-full text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors' 
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button 
                    className='py-1.5 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium shadow-sm transition-all hover:shadow active:scale-95' 
                    onClick={updateUserRole}
                >
                    Change Role
                </button>
            </div>
       </div>
    </div>
  )
}

export default ChangeUserRole