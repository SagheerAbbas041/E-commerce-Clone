import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-slate-200'>
      <div className='container mx-auto p-4'>
       <p className='text-center font-bold' title="Youtube Channel">&copy; {new Date().getFullYear()}<Link to='https://github.com/SagheerAbbas041' target='_blank' rel='noopener noreferrer'> Sagheer Abbas </Link>All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer