import React, { useContext, useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);

                const tokenToSave = typeof dataApi.data === 'string' ? dataApi.data : dataApi.token;
                if (tokenToSave) {
                    localStorage.setItem("token", tokenToSave);
                }

                await fetchUserDetails(tokenToSave);
                await fetchUserAddToCart(tokenToSave);

                navigate('/');
            } else if (dataApi.error) {
                toast.error(dataApi.message);
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id='login' className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-slate-50'>
            <div className='bg-white p-6 sm:p-8 w-full max-w-sm sm:max-w-md mx-auto rounded-2xl shadow-md border border-slate-100 transition-all'>
                
                {/* Profile Avatar / GIF */}
                <div className='w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden p-1 bg-slate-100 shadow-inner flex items-center justify-center'>
                    <img src={loginIcons} alt='Login Icon' className='w-full h-full object-cover' />
                </div>

                <h2 className='text-center font-bold text-xl sm:text-2xl text-slate-800 mt-3'>Welcome Back</h2>
                <p className='text-center text-slate-500 text-xs sm:text-sm mb-4'>Please enter your details to log in.</p>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    
                    {/* Email Input */}
                    <div>
                        <label className='block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5'>
                            Email Address
                        </label>
                        <div className='bg-slate-50 border border-slate-200 focus-within:border-red-600 focus-within:bg-white p-2.5 rounded-xl transition-colors'>
                            <input
                                type='email'
                                placeholder='enter email'
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                className='w-full h-full outline-none bg-transparent text-xs sm:text-sm text-slate-800'
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className='block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5'>
                            Password
                        </label>
                        <div className='bg-slate-50 border border-slate-200 focus-within:border-red-600 focus-within:bg-white p-2.5 rounded-xl flex items-center transition-colors'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder='enter password'
                                value={data.password}
                                name='password'
                                onChange={handleOnChange}
                                className='w-full h-full outline-none bg-transparent text-xs sm:text-sm text-slate-800'
                                required
                            />
                            <button
                                type='button'
                                className='cursor-pointer text-slate-500 hover:text-slate-700 text-lg px-1 transition-colors'
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label="Toggle Password Visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        
                        <Link 
                            to={'/forgot-password'} 
                            className='block w-fit ml-auto mt-2 text-xs text-slate-500 hover:underline hover:text-red-600 font-medium transition-colors'
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type='submit'
                        disabled={loading}
                        className={`w-full py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 flex items-center justify-center mt-2 ${
                            loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Redirect Link */}
                <div className='mt-6 text-center border-t border-slate-100 pt-4'>
                    <p className='text-xs sm:text-sm text-slate-500'>
                        Don't have an account?{' '}
                        <Link to={"/sign-up"} className='text-red-600 font-semibold hover:underline transition-colors'>
                            Sign up
                        </Link>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Login;