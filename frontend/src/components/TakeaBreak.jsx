import React from 'react'
import { assets } from '../assets/assets'

const TakeaBreak = () => {
  return (
    <div className="flex items-center space-x-2">
        <span className="text-blue-700 text-2xl font-semibold">Remember to take a break!!</span>
        <img src={assets.CupOfCoffee} className='w-[50px]' alt="" />
    </div>
  )
}

export default TakeaBreak