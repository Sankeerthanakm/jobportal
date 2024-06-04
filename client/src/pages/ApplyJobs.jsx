import React, { useEffect, useState } from 'react'
import { apiRequest, updateURL } from '../utils'
import { CustomButton, JobCard } from '../components'
import { useLocation, useNavigate } from 'react-router-dom'

function ApplyJobs() {
    const location=useLocation()
    const navigate=useNavigate()
    const [data,setData]=useState([])
    const [isFetching,setIsFetching]=useState(false)
    const [page,setPage]=useState(null)
    const [numPage,setNumPage]=useState(null)

    const fetchData=async ()=>{
        setIsFetching(true)
       const params=new URLSearchParams()
       if(page && page >1){
        params.set("page",page)
       }
       const newUrl=`?${params.toString()}`
       navigate(newUrl,{replace:true})
      
        try {
            const res=await apiRequest({
                url:"/jobs/find-jobs"+newUrl,
                method:"GET"
            })
            setData(res?.data)
            setPage(res?.page)
            setNumPage(res?.numOfPage)
           console.log(data)
           setIsFetching(false)
            
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(()=>{
        fetchData()
    },[page])

    const handlleShowMore=async (e)=>{
        e.preventDefault()
        setPage((prev)=> prev+1)
     }
    


  return (
    <div className='container mx-auto px-10 pt-10'>
          <div  className='w-full flex flex-wrap gap-4'>
              {data?.map((job,index)=>{
                  const data={
                    name: job?.company?.name,
                    email: job?.company?.email,
                    logo:job?.company?.profileUrl,
                    ...job,
                  }
                   
                  return <JobCard job={data}  key={index}/>
              })}
          </div>
          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16 pb-5'>
              <CustomButton
               onClick={handlleShowMore}
                title='Load More'
                containerStyles={`text-black py-1.5 px-5 focus:outline-none hover:bg-black hover:text-white rounded-full text-base border border-black`}
              />
            </div>
          )}
    </div>
  )
}

export default ApplyJobs