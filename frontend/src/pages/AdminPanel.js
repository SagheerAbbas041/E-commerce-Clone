import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser, FaUsers, FaBoxesPacking, FaBars, FaXmark } from "react-icons/fa6";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (user && user?.role !== ROLE.ADMIN) {
            navigate("/")
        }
    }, [user, navigate])

    // Route change hone par mobile drawer auto-close karne ke liye
    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    return (
        <div className='min-h-[calc(100vh-120px)] flex flex-col md:flex-row relative bg-slate-50'>
            
            {/* Mobile Header Bar */}
            <div className='md:hidden bg-white px-4 py-3 shadow-sm border-b border-slate-200 flex justify-between items-center sticky top-0 z-30'>
                <div className='flex items-center gap-3'>
                    <div className='text-2xl text-slate-700'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-8 h-8 rounded-full object-cover border border-slate-200' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser />
                        )}
                    </div>
                    <div>
                        <p className='capitalize text-xs font-semibold text-slate-800 leading-none'>{user?.name || "Admin"}</p>
                        <p className='text-[10px] text-slate-500 uppercase tracking-wider'>{user?.role}</p>
                    </div>
                </div>

                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className='text-slate-700 text-xl p-2 rounded-md hover:bg-slate-100 transition-colors'
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <FaXmark /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {menuOpen && (
                <div 
                    className='fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity'
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Responsive Sidebar (Desktop Permanent + Mobile Drawer) */}
            <aside className={`
                fixed md:static top-0 left-0 h-full md:min-h-full w-64 md:w-60 bg-white z-50 md:z-auto
                shadow-lg md:shadow-none border-r border-slate-200 transform transition-transform duration-300 ease-in-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Mobile Drawer Header */}
                <div className='flex md:hidden justify-between items-center p-4 border-b border-slate-100'>
                    <h2 className='font-bold text-slate-800 text-base'>Admin Menu</h2>
                    <button onClick={() => setMenuOpen(false)} className='text-slate-500 text-lg p-1'>
                        <FaXmark />
                    </button>
                </div>

                {/* Profile Section */}
                <div className='p-6 flex justify-center items-center flex-col border-b border-slate-100 bg-slate-50/50'>
                    <div className='text-5xl cursor-pointer relative flex justify-center mb-2 text-slate-600'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full object-cover shadow-sm border-2 border-white' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser />
                        )}
                    </div>
                    <p className='capitalize text-base font-semibold text-slate-800 text-center line-clamp-1'>{user?.name}</p>
                    <span className='text-[11px] bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full capitalize mt-1'>
                        {user?.role}
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className='grid gap-1 p-3'>
                    <Link 
                        to={"all-users"} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            location.pathname.includes('all-users') 
                                ? 'bg-red-50 text-red-600' 
                                : 'text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <FaUsers className='text-base' />
                        <span>All Users</span>
                    </Link>

                    <Link 
                        to={"all-products"} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            location.pathname.includes('all-products') 
                                ? 'bg-red-50 text-red-600' 
                                : 'text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <FaBoxesPacking className='text-base' />
                        <span>All Products</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className='flex-1 h-full p-3 sm:p-4 md:p-6 overflow-y-auto min-w-0'>
                <div className='bg-white rounded-md p-3 sm:p-4 shadow-sm border border-slate-100 min-h-[calc(100vh-160px)]'>
                    <Outlet />
                </div>
            </main>

            {/* Quick Access Mobile Bottom Bar */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 z-30 shadow-lg'>
                <Link 
                    to={"all-users"} 
                    className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
                        location.pathname.includes('all-users') ? 'text-red-600' : 'text-slate-600'
                    }`}
                >
                    <FaUsers className='text-lg' />
                    <span>Users</span>
                </Link>
                <Link 
                    to={"all-products"} 
                    className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
                        location.pathname.includes('all-products') ? 'text-red-600' : 'text-slate-600'
                    }`}
                >
                    <FaBoxesPacking className='text-lg' />
                    <span>Products</span>
                </Link>
            </div>
        </div>
    )
}

export default AdminPanel