import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 px-4 lg:px-44 py-3'>
      <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
          <img 
              className='w-auto h-[20px] sm:h-[25px] md:h-[35px] transition-all duration-300 ease-in-out' 
              src={assets.logo} 
              alt="Clipify Logo" 
          />
          <span className='font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent'>
              Clipify
          </span>
      </Link>
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @Clipify | All right reserved.</p>
      <div className='flex gap-1'>
        <img width={40} src={assets.facebook_icon} alt="" />
        <img width={40} src={assets.twitter_icon} alt="" />
        <img width={40} src={assets.google_plus_icon} alt="" />
      </div>
    </div>
  )
}

export default Footer