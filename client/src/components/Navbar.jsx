import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { isSignedIn, user } = useUser()
    const { credit, loadCreditsData } = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (isSignedIn) {
            loadCreditsData()
        }
    }, [isSignedIn])

    return (
        <div className='flex items-center justify-between mx-4 py-3 lg:mx-44 '>
            <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
                <img 
                    className='w-auto h-[35px] sm:h-[40px] md:h-[50px] transition-all duration-300 ease-in-out' 
                    src={assets.logo} 
                    alt="Clipify Logo" 
                />
                <span className='text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent'>
                    Clipify
                </span>
            </Link>
            {isSignedIn
                ? <div className='flex items-center gap-2 sm:gap-3'>
                    <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
                        <img className='w-5' src={assets.credit_icon} alt='' />
                        <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits : {credit}</p>
                    </button>
                    <p className='text-gray-600 max-sm:hidden'>Hi, {user.fullName}</p>
                    <UserButton />
                </div>
                : <button onClick={() => openSignIn({})} className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3  text-sm rounded-full'>
                    Get started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
                </button>
            }
        </div>
    )
}

export default Navbar