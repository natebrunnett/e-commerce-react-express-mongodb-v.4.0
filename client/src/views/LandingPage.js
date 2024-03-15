import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";

function LandingPage({setNav}) {
  useEffect(()=> {
    setNav(false)
  }, [])
  const navigate = useNavigate()
  return (
    <div className='flex flex-col w-screen h-screen bg-slate-300 items-center justify-center'>
        <h1>E Commerce Delivery App</h1>
        <div>Food Icon</div>
        <button onClick={() => navigate('/Menu')}>Menu</button>
    </div>
  )
}

export default LandingPage