import { isValidObjectId } from "mongoose";
import { Users } from "../models/userModel.js";


export const userUpdateProfile=async(req,res,next)=>{
   
    const {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
      } = req.body;

    try {
        if (!firstName || !lastName  || !contact || !jobTitle || !about) {
            next("Please provide all required fields");
        }

        const id=req.body.user.userId
        if(!isValidObjectId(id)){
            next("unauthorized access")
            return
        }

      const updatedUser=  await Users.findByIdAndUpdate(id,
             { $set:{
                  firstName,
                  lastName,
                  email,
                  contact,
                  jobTitle,
                  about,
                  profileUrl,
                  location
              }},
              {new:true}
            )
          

            if(!updatedUser){
                next("something went wrong while updating")
                return
            }


            const user=await Users.findById(updatedUser._id).select("-password")
            const token=await user.createToken()


            res.status(200).send({
                success:true,
                messege:"updated details successfully",
                user,
                token,
      })

        
    } catch (error) {
        console.log(error)
       res.status(404).json({messege:error.messege})
    }
}

export const getUser=async(req,res,next)=>{
     try {
         const id=req.body.user.userId
   
         if(!isValidObjectId(id)){
           next("invalid request id")
           return
         }
   
        const user= await Users.findById(id).select("-password")
   
        if(!user){
           next("user not found")
           return
        }
   
        res.status(200).send({
           success:true,
           messege:"fetched userdata  seccessfully",
           user
        })
     } catch (error) {
        console.log(error)
        res.status(404).json({messege:error.messege})
     }
}