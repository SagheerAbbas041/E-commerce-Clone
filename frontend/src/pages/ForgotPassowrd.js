import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineMail } from 'react-icons/md'
import { IoKeyOutline } from 'react-icons/io5'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your registered email address.")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(SummaryApi.forgotPassword?.url || '', {
                method: SummaryApi.forgotPassword?.method || 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            const dataResponse = await response.json()

            if (dataResponse.success) {
                toast.success(dataResponse.message || "Reset link sent to your email!")
                setEmail("")
            } else if (dataResponse.error) {
                toast.error(dataResponse.message)
            }
        } catch (error) {
            console.error("Forgot Password Error:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id='forgot-password' className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-slate-50'>
            <div className='bg-white w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100 transition-all'>
                
                {/* Header Icon & Title */}
                <div className='flex flex-col items-center text-center mb-6'>
                    <div className='w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3 shadow-inner'>
                        <IoKeyOutline size={28} />
                    </div>
                    <h2 className='text-xl sm:text-2xl font-bold text-slate-800'>Forgot Password?</h2>
                    <p className='text-slate-500 text-xs sm:text-sm mt-1 max-w-xs'>
                        No worries! Enter your registered email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='email' className='block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5'>
                            Email Address
                        </label>
                        <div className='relative flex items-center'>
                            <span className='absolute left-3 text-slate-400'>
                                <MdOutlineMail size={20} />
                            </span>
                            <input 
                                type='email' 
                                id='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='example@domain.com' 
                                required
                                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-red-600 focus:bg-white transition-all'
                            />
                        </div>
                    </div>

                    <button 
                        type='submit'
                        disabled={loading}
                        className={`w-full py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 flex items-center justify-center ${
                            loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Navigation Back to Login */}
                <div className='mt-6 text-center border-t border-slate-100 pt-4'>
                    <p className='text-xs sm:text-sm text-slate-500'>
                        Remember your password?{' '}
                        <Link to='/login' className='text-red-600 font-semibold hover:underline transition-all'>
                            Back to Login
                        </Link>
                    </p>
                </div>

            </div>
        </section>
    )
}

export default ForgotPassword