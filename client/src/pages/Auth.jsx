import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Office } from '../assets'
import SignUp from '../components/SignUp'

function Auth() {
  const {user}=useSelector((state)=>state.user)
  const[open,setOpen]=useState(true)
  const location=useLocation()

  let from=location?.state?.from?.pathname || "/"
  if(user?.token){
    return window.location.replace(from)
  }
  
  return (
   
     <div className='w-full '>
      <img src="https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg" alt='Office' className='object-contain ' />

       <SignUp  open={open} setOpen={setOpen}/>
    </div>

  )
}

export default Auth