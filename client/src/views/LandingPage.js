import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";

function LandingPage({setNav}) {
  useEffect(()=> {
    setNav(false)
  }, [])
  const navigate = useNavigate()
  return (
    <div className='flex flex-col w-screen h-screen bg-slate-300 items-center justify-center'>
        <h1 className='font-bold mb-3 text-3xl text-center ml-6'>E commerce delivery app
        <span className='text-sm italic'> v-4.0</span></h1>
        <div><MdRestaurantMenu size={"96px"}/></div>
        <button 
        className='bg-amber-700 pl-6 pr-6 pt-3 pb-3 mt-3 text-white rounded-3xl'
        onClick={() => navigate('/Menu')}>Menu</button>
    </div>
  )
}

export default LandingPage