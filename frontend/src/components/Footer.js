import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-slate-200 border-t border-slate-300/60 mt-auto'>
      <div className='container mx-auto px-4 py-4 sm:py-6'>
        <p className='text-center text-xs sm:text-sm md:text-base font-medium text-slate-700 tracking-wide flex items-center justify-center flex-wrap gap-1'>
          <span>&copy; {new Date().getFullYear()}</span>
          <Link 
            to='https://github.com/SagheerAbbas041' 
            target='_blank' 
            rel='noopener noreferrer'
            className='font-semibold text-slate-900 hover:text-red-600 transition-colors underline decoration-slate-400 underline-offset-4 hover:decoration-red-600'
            title="GitHub Profile"
          >
            Sagheer Abbas
          </Link>
          <span>. All rights reserved.</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer