import React, { useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imagePic = await imageTobase64(file);
      setData((prev) => ({
        ...prev,
        profilePic: imagePic
      }));
    } catch (error) {
      toast.error("Failed to process profile image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message || "Failed to sign up");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id='signup' className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-slate-50'>
      <div className='bg-white p-6 sm:p-8 w-full max-w-md mx-auto rounded-2xl shadow-sm border border-slate-100'>
        
        {/* Profile Picture Upload Section */}
        <div className='w-24 h-24 mx-auto relative overflow-hidden rounded-full border-2 border-red-600 shadow-sm group'>
          <img 
            src={data.profilePic || loginIcons} 
            alt='Profile Preview' 
            className='w-full h-full object-cover'
          />
          <label className='cursor-pointer'>
            <div className='text-[10px] sm:text-xs bg-slate-900/70 text-white py-1.5 cursor-pointer text-center absolute bottom-0 w-full transition-all group-hover:bg-red-600/90'>
              Upload Photo
            </div>
            <input 
              type='file' 
              accept="image/*" 
              className='hidden' 
              onChange={handleUploadPic}
            />
          </label>
        </div>

        {/* Form Container */}
        <form className='pt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
          
          {/* Name Field */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-slate-600'>Full Name</label>
            <div className='bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-red-600 transition-all'>
              <input 
                type='text' 
                placeholder='Enter your name' 
                name='name'
                value={data.name}
                onChange={handleOnChange}
                required
                className='w-full outline-none bg-transparent text-sm text-slate-800'
              />
            </div>
          </div>

          {/* Email Field */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-slate-600'>Email Address</label>
            <div className='bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-red-600 transition-all'>
              <input 
                type='email' 
                placeholder='Enter your email' 
                name='email'
                value={data.email}
                onChange={handleOnChange}
                required
                className='w-full outline-none bg-transparent text-sm text-slate-800'
              />
            </div>
          </div>

          {/* Password Field */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-slate-600'>Password</label>
            <div className='bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-red-600 transition-all flex items-center justify-between'>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder='Enter password'
                value={data.password}
                name='password' 
                onChange={handleOnChange}
                required
                className='w-full outline-none bg-transparent text-sm text-slate-800 pr-2'
              />
              <button 
                type='button' 
                className='cursor-pointer text-slate-500 hover:text-slate-800 text-lg transition-colors' 
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-slate-600'>Confirm Password</label>
            <div className='bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-red-600 transition-all flex items-center justify-between'>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder='Confirm password'
                value={data.confirmPassword}
                name='confirmPassword' 
                onChange={handleOnChange}
                required
                className='w-full outline-none bg-transparent text-sm text-slate-800 pr-2'
              />
              <button 
                type='button' 
                className='cursor-pointer text-slate-500 hover:text-slate-800 text-lg transition-colors' 
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className='bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm active:scale-95 mt-4 w-full flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>

        </form>

        {/* Login Redirect */}
        <p className='mt-6 text-center text-xs sm:text-sm text-slate-600'>
          Already have an account?{' '}
          <Link to={"/login"} className='text-red-600 font-semibold hover:text-red-700 hover:underline transition-all'>
            Login
          </Link>
        </p>

      </div>
    </section>
  );
};

export default SignUp;