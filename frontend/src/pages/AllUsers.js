import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    })

    const fetchAllUsers = async () => {
        setLoading(true)
        try {
            const fetchData = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: 'include'
            })

            const dataResponse = await fetchData.json()

            if (dataResponse.success) {
                setAllUsers(dataResponse.data)
            } else if (dataResponse.error) {
                toast.error(dataResponse.message)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    return (
        <div className='bg-white p-3 sm:p-4 rounded-md shadow-sm border border-slate-100 w-full'>
            
            {/* Header Section */}
            <div className='flex justify-between items-center pb-3 mb-3 border-b border-slate-100'>
                <div>
                    <h2 className='font-bold text-base sm:text-lg text-slate-800'>All Users</h2>
                    <p className='text-xs text-slate-500'>
                        Total Users: <span className='font-semibold text-slate-700'>{allUser.length}</span>
                    </p>
                </div>
            </div>

            {/* Mobile View: Card Layout (< 640px) */}
            <div className='block sm:hidden grid gap-3'>
                {loading ? (
                    new Array(4).fill(null).map((_, index) => (
                        <div key={`user-skeleton-${index}`} className='bg-slate-50 p-3 rounded-lg border border-slate-200 animate-pulse grid gap-2'>
                            <div className='h-4 bg-slate-200 rounded w-1/3' />
                            <div className='h-3 bg-slate-200 rounded w-2/3' />
                            <div className='h-3 bg-slate-200 rounded w-1/2' />
                        </div>
                    ))
                ) : allUser.length > 0 ? (
                    allUser.map((el, index) => (
                        <div key={el?._id || index} className='bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-start text-xs gap-2'>
                            <div className='grid gap-1 min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <span className='font-bold text-slate-400'>#{index + 1}</span>
                                    <p className='font-semibold text-slate-800 text-sm truncate'>{el?.name}</p>
                                </div>
                                <p className='text-slate-600 truncate'>{el?.email}</p>
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                        el?.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {el?.role}
                                    </span>
                                    <span className='text-[10px] text-slate-400'>
                                        {moment(el?.createdAt).format('ll')}
                                    </span>
                                </div>
                            </div>
                            <button 
                                className='bg-green-100 p-2 rounded-full text-green-700 hover:bg-green-600 hover:text-white transition-colors flex-shrink-0'
                                onClick={() => {
                                    setUpdateUserDetails(el)
                                    setOpenUpdateRole(true)
                                }}
                                aria-label="Edit Role"
                            >
                                <MdModeEdit size={16} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-xs text-slate-400 py-6'>No users found.</p>
                )}
            </div>

            {/* Tablet & Desktop View: Table Layout (>= 640px) */}
            <div className='hidden sm:block overflow-x-auto scrollbar-none'>
                <table className='w-full text-left border-collapse min-w-[600px]'>
                    <thead>
                        <tr className='bg-slate-800 text-white text-xs sm:text-sm'>
                            <th className='p-2.5 rounded-tl-md text-center w-12'>Sr.</th>
                            <th className='p-2.5'>Name</th>
                            <th className='p-2.5'>Email</th>
                            <th className='p-2.5'>Role</th>
                            <th className='p-2.5'>Created Date</th>
                            <th className='p-2.5 rounded-tr-md text-center w-16'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-xs sm:text-sm divide-y divide-slate-100 text-slate-700'>
                        {loading ? (
                            new Array(5).fill(null).map((_, index) => (
                                <tr key={`row-skeleton-${index}`} className='animate-pulse'>
                                    <td className='p-3 text-center'><div className='h-4 bg-slate-200 rounded mx-auto w-4' /></td>
                                    <td className='p-3'><div className='h-4 bg-slate-200 rounded w-24' /></td>
                                    <td className='p-3'><div className='h-4 bg-slate-200 rounded w-36' /></td>
                                    <td className='p-3'><div className='h-4 bg-slate-200 rounded w-16' /></td>
                                    <td className='p-3'><div className='h-4 bg-slate-200 rounded w-20' /></td>
                                    <td className='p-3 text-center'><div className='h-6 bg-slate-200 rounded-full w-6 mx-auto' /></td>
                                </tr>
                            ))
                        ) : allUser.length > 0 ? (
                            allUser.map((el, index) => (
                                <tr key={el?._id || index} className='hover:bg-slate-50 transition-colors'>
                                    <td className='p-2.5 text-center font-medium text-slate-500'>{index + 1}</td>
                                    <td className='p-2.5 font-medium text-slate-800'>{el?.name}</td>
                                    <td className='p-2.5 text-slate-600'>{el?.email}</td>
                                    <td className='p-2.5 capitalize'>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            el?.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {el?.role}
                                        </span>
                                    </td>
                                    <td className='p-2.5 text-slate-500'>{moment(el?.createdAt).format('LL')}</td>
                                    <td className='p-2.5 text-center'>
                                        <button 
                                            className='bg-green-100 p-2 rounded-full text-green-700 hover:bg-green-600 hover:text-white transition-colors inline-flex items-center justify-center' 
                                            onClick={() => {
                                                setUpdateUserDetails(el)
                                                setOpenUpdateRole(true)
                                            }}
                                            aria-label="Edit Role"
                                        >
                                            <MdModeEdit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className='p-6 text-center text-slate-400 text-sm'>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Change User Role Modal */}
            {openUpdateRole && (
                <ChangeUserRole 
                    onClose={() => setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    )
}

export default AllUsers