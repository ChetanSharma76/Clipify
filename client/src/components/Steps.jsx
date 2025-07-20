import React from 'react'
import { assets } from '../assets/assets'

const Steps = () => {
    return (
        <div className='mx-4 lg:mx-44 py-20 xl:py-40 '>

            <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>Steps to remove background <br /> image in seconds.</h1>

            {/* The container is centered and wraps items */}
            <div className='flex items-stretch flex-wrap gap-4 mt-16 xl:mt-24 justify-center'>

                {/* Card 1: Added classes for equal width and responsiveness */}
                <div className='flex flex-1 items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 min-w-[300px] max-w-sm'>
                    <img className='max-w-9' src={assets.upload_icon} alt="Upload icon" />
                    <div>
                        <p className='text-xl font-medium'>Upload image</p>
                        <p className='text-sm text-neutral-500 mt-1'>Simply drag and drop or select an image file from your device.</p>
                    </div>
                </div>

                {/* Card 2: Added classes for equal width and responsiveness */}
                <div className='flex flex-1 items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 min-w-[300px] max-w-sm'>
                    <img className='max-w-9' src={assets.remove_bg_icon} alt="Remove background icon" />
                    <div>
                        <p className='text-xl font-medium'>Remove background</p>
                        <p className='text-sm text-neutral-500 mt-1'>AI automatically detects and removes the background in seconds.<br /></p>
                    </div>
                </div>

                {/* Card 3: Added classes for equal width and responsiveness */}
                <div className='flex flex-1 items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 min-w-[300px] max-w-sm'>
                    <img className='max-w-9' src={assets.download_icon} alt="Download icon" />
                    <div>
                        <p className='text-xl font-medium'>Download image</p>
                        <p className='text-sm text-neutral-500 mt-1'> Instantly download your new image with a transparent background.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Steps
