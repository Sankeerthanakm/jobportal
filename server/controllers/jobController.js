import { isValidObjectId } from "mongoose";
import { Jobs } from "../models/jobsModel.js";
import { Companies } from "../models/companiesModel.js";

export const createJob =async(req,res,next)=>{
    try {
        const {
            jobTitle,
            jobType,
            location,
            salary,
            vaccancy,
            experience,
            desc,
            requirements,
          } = req.body;

          if (
            !jobTitle ||
            !jobType ||
            !location ||
            !salary ||
            !requirements||
            !experience 
            
         ) {
            next("Please Provide All Required Fields");
            return;
          }

          const id=req.body.user.userId

          if(!isValidObjectId(id)){
            next("unauthorised access")
            return
          }

         const job= await Jobs.create({
            jobTitle,
            jobType,
            location,
            salary,
            vaccancy,
            experience,
            detail: { desc, requirements },
            company:id
          })
        

          if(!job){
            next("job is not uploaded")
            return
          }

       const company=  await Companies.findByIdAndUpdate(id,{
            $push:{
                jobPosts:job?._id
            }
         },
         {new:true})

         if(!company){
            next("something went wrong while updating company model")
            return
         }

         
    res.status(200).json({
        success: true,
        message: "Job Posted SUccessfully",
        job,
      });
    } catch (error) {
        console.log(error);
    res.status(404).json({ message: error.message });
    }
}

export const updateJob =async(req,res,next)=>{
    try {

        const {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            desc,
            requirements,
          } = req.body;

          const { jobId } = req.params;

          if(!isValidObjectId(jobId)){
            next("invalid request ")
            return
          }

          if (
            !jobTitle ||
            !jobType ||
            !location ||
            !salary ||
            !desc ||
            !requirements
          ) {
            next("Please Provide All Required Fields");
            return;
          }

          const id=req.body.user.userId
          if(!isValidObjectId(id)){
            next("unauthorised access")
          }

        const jobPost= await Jobs.findByIdAndUpdate(jobId,
        {
            $set:{
                jobTitle,
                jobType,
                location,
                salary,
                vacancies,
                experience,
                detail: { desc, requirements },
               
            }
          },{new:true})


        if(!jobPost){
            next("cant update the job details")
            return
        }

        res.status(200).json({
            success: true,
            message: "Job Post Updated SUccessfully",
            jobPost,
          });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}

export const getJobPosts =async(req,res,next)=>{
    try {
        const { search, sort, location, jtype, exp } = req.query;
        const types = jtype?.split(","); //full-time,part-time
        const experience = exp?.split("-"); //2-6
    
    
    
    
        let queryObject = {};
    
        if (location) {
          queryObject.location = { $regex: location, $options: "i" };
        }
    
        if (jtype) {
          queryObject.jobType = { $in: types };
        }
    
        //    [2. 6]
    
        if (exp) {
          queryObject.experience = {
            $gte: Number(experience[0]) - 1,
            $lte: Number(experience[1]) + 1,
          };
        }
    
        if (search) {
          const searchQuery = {
            $or: [
              { jobTitle: { $regex: search, $options: "i" } },
              { jobType: { $regex: search, $options: "i" } },
            ],
          };
          queryObject = { ...queryObject, ...searchQuery };
        }
    
        let queryResult = Jobs.find(queryObject).populate({
          path: "company",
          select: "-password",
        });
    
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
          }
          if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
          }
          if (sort === "A-Z") {
            queryResult = queryResult.sort("jobTitle");
          }
          if (sort === "Z-A") {
            queryResult = queryResult.sort("-jobTitle");
          }
      // pagination
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      const skip = (page - 1) * limit;
    
      //records count
      const totalJobs = await Jobs.countDocuments(queryResult);
      const numOfPage = Math.ceil(totalJobs / limit);
    
      queryResult = queryResult.limit(limit * page);
    
      const jobs = await queryResult;
      res.status(200).json({
        success: true,
        totalJobs,
        data: jobs,
        page,
        numOfPage,
      });
      
    
    
    } catch (error) {
        console.log(error);
    res.status(404).json({ message: error.message });
    }

} 

export const getJobById =async(req,res,next)=>{
   try {
     const {id}=req.params

     if(!isValidObjectId(id)){
        next("invalid request")
        return
     }

    const job= await Jobs.findById(id).populate({
        path:"company",
        select: "-password",
    }) 

    if(!job){
        return res.status(200).send({
            message: "Job Post Not Found",
            success: false,
          });
    }

    //similar jobs 


    const searchQuery={
        $or:[
            {jobTitle:{$regex:job?.jobTitle,$options:"i"}},
            {jobType:{$regex:job?.jobType,$options:"i"}}
        ]
    }

   const queryResult= await Jobs.find(searchQuery).populate({
    path:"company",
    select:"-password"
   }).sort({ _id: -1 });

  const similarJobs= await queryResult

  res.status(200).json({
    success: true,
    data: job,
    similarJobs,
  });





   } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
   }

}

export const deleteJobPost =async(req,res,next)=>{
    try {
        const { id } = req.params;
    
        await Jobs.findByIdAndDelete(id);
    
        res.status(200).send({
          success: true,
          message: "Job Post Deleted Successfully.",
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
}

export const applyJob=async(req,res,next)=>{
  try {
    const {id}=req.params

    const applied=await Jobs.findByIdAndUpdate(id,{
      $push:{
        application:req.body.user.userId
      }
    },{new:true})

    if(!applied){
      res.status(500).send("Something went wrong")
    }
     res.status(200).send({
      success:true,
      messege:"Applied for job successfully"
     })

    
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: error.message });
  }
}  

export const recentAppliedJobs=async(req,res,next)=>{
      const id=req.body.user.userId
     try {
        const appliedJobs=await Jobs.find({'application': id})

        if(!appliedJobs){
          res.status(200).send({success:true,message:"No Applied Jobs"})
        }

        res.status(200).send({
          success:true,
          message:"fetch jobs successfully",
          data:appliedJobs
        })
        
    } catch (error) {
       console.log(error)
       res.status(504).json({message :error.message})
    }

     
      


}