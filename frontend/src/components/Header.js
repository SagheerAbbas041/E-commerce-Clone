import React, { useContext, useState } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2"; // Order Icon
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      });

      const data = await fetchData.json();

      localStorage.removeItem("token");
      dispatch(setUserDetails(null));

      if (context?.fetchUserAddToCart) {
        context.fetchUserAddToCart();
      }

      if (data.success || fetchData.ok) {
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.message || "Logged out");
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.removeItem("token");
      dispatch(setUserDetails(null));
      window.location.href = "/login";
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40 top-0 left-0'>
      <div className='h-full container mx-auto flex items-center px-2 sm:px-4 justify-between gap-2 sm:gap-4'>
        
        {/* Logo */}
        <div className='flex items-center flex-shrink-0'>
          <Link to={"/"} className='flex items-center'>
            <Logo w={120} h={50} className="w-24 sm:w-32 md:w-36 h-auto" />
          </Link>
        </div>

        {/* Search Bar - Visible on Small Screens & Up */}
        <div className='flex items-center w-full max-w-[180px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md border rounded-full focus-within:shadow-md focus-within:border-red-500 pl-3 overflow-hidden transition-all'>
          <input
            type='text'
            placeholder='Search product here...'
            className='w-full outline-none text-xs sm:text-sm bg-transparent pr-1'
            onChange={handleSearch}
            value={search}
          />
          <div className='text-xs sm:text-sm min-w-[36px] sm:min-w-[45px] h-8 bg-red-600 flex items-center justify-center text-white flex-shrink-0 cursor-pointer hover:bg-red-700 transition-colors'>
            <GrSearch />
          </div>
        </div>

        {/* User Actions */}
        <div className='flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0'>
          
          {/* User Profile Avatar & Dropdown */}
          <div className='relative flex justify-center'>
            {user?._id && (
              <div
                className='text-xl sm:text-2xl md:text-3xl cursor-pointer relative flex justify-center items-center rounded-full p-0.5 border border-slate-200 hover:border-red-500 transition-all'
                onClick={() => setMenuDisplay(preve => !preve)}
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover' alt={user?.name} />
                ) : (
                  <FaRegCircleUser className='text-slate-700 hover:text-red-600' />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className='absolute bg-white right-0 top-10 sm:top-12 h-fit p-2 shadow-xl rounded-md border border-slate-100 min-w-[140px] z-50 animate-in fade-in zoom-in-95 duration-150'>
                <nav className='flex flex-col gap-1 text-xs sm:text-sm text-slate-700'>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className='whitespace-nowrap hover:bg-slate-100 p-2 rounded transition-colors font-medium text-slate-800'
                      onClick={() => setMenuDisplay(preve => !preve)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {/* Mobile Friendly Logout Option inside Menu */}
                  <button 
                    onClick={() => { handleLogout(); setMenuDisplay(false); }}
                    className='text-left text-red-600 hover:bg-red-50 p-2 rounded transition-colors font-medium md:hidden'
                  >
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* User Logged-in Actions (Orders & Cart Badges) */}
          {user?._id && (
            <div className='flex items-center gap-3 sm:gap-5 md:gap-6'>
              {/* Order Page Link */}
              <Link to={"/order"} className='text-lg sm:text-xl md:text-2xl relative cursor-pointer text-slate-700 hover:text-red-600 transition-colors p-1' title='Your Orders'>
                <span><HiShoppingBag /></span>
                <div className='bg-red-600 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center absolute -top-1 -right-2 sm:-top-1 sm:-right-2.5 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-semibold'>{context?.orderCount || 0}</p>
                </div>
              </Link>

              {/* Cart Page Link */}
              <Link to={"/cart"} className='text-lg sm:text-xl md:text-2xl relative cursor-pointer text-slate-700 hover:text-red-600 transition-colors p-1' title='Cart'>
                <span><FaShoppingCart /></span>
                <div className='bg-red-600 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center absolute -top-1 -right-2 sm:-top-1 sm:-right-2.5 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-semibold'>{context?.cartProductCount || 0}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Desktop/Tablet Login-Logout Button */}
          <div>
            {user?._id ? (
              <button 
                onClick={handleLogout} 
                className='hidden md:block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95'
              >
                Logout
              </button>
            ) : (
              <Link 
                to={"/login"} 
                className='px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95 inline-block'
              >
                Login
              </Link>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;