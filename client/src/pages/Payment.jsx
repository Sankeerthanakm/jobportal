import React from 'react'
import { useForm } from 'react-hook-form';
import { apiRequest } from '../utils';
import { useSelector } from 'react-redux';
import {loadStripe} from '@stripe/stripe-js';

function Payment() {
    const{ user}=useSelector((state)=>state.user)
    
    const data=[
      {
        id:1,
        title:"Basic Plan",
        price:"99"
      },
      {
        id:2,
        title:"Pro Plan",
        price:"399"
      },
      {
        id:3,
        title:"Business Plan",
        price:"699"
      }
    ]

    
    // const onSubmit =  (plan) => {
    //     // Handle payment submission
    //    fetch("http:/localhost:8000/api-v1/payments/create-checkout-session",{
    //     method:"POST",
    //     headers:{
    //       "Content-Type":"application/json",
        
    //     },
       
    //     body:JSON.stringify({plan:plan,customerId:user?._id})
    //    }
    //    )

    //    .then((res)=>{
    //     if(res.ok)  return res.json();
    //     console.log( "response from server" ,res)
    //     return res.json().then((json)=> Promise.reject(json))
    //    })
    //    .then(({session})=>{
    //     window.location=session.url;
    //    })
    //    .catch((e)=>{
    //       console.error("Error redirecting session:", e);
    //        console.log(e.error)
    //    })
      
    //   };

    const onSubmit=async (plan)=>{
      try {
        const res=await  apiRequest({
           url:"/payments/create-checkout-session",
           token:user?.token,
           data:plan,
           method:"POST"
        })
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Choose a Plan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

     {data.map((each,index)=>(
    
       <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
       <div className="p-6">
         <h2 className="text-xl font-bold mb-2">{each.title}</h2>
         <p className="text-gray-600 mb-4">{each.price} / month</p>
         <button onClick={()=>{onSubmit(Number(each.price))}} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 block w-full">
           Select Plan
         </button>
       </div>
     </div>
 )) }
       </div>
      </div>
    </div>
  )
}

export default Payment