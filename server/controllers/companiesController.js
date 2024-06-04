import { isValidObjectId } from "mongoose"
import { Companies } from "../models/companiesModel.js"


export const register=async(req,res,next)=>{
    const {name,email,password}=req.body

    if(!email || !name || !password){
        next("all fields are required")
        return
    }
    try {

      const existUser=  await Companies.findOne({email})
      if(existUser){
        next("user already exist with this email")
        return
      }

      const userCompany=await Companies.create({
            email,
            name,
            password
      })

      if(!userCompany){
        next("something went wrong while creating account")
        return
      }
     const company=await Companies.findById(userCompany?._id).select("-password")
      const token= await company.createToken()

      res.status(200)
       .send({
        success:true,
        messege:"Account created for company succesfully",
        user: {
          _id: company._id,
          name: company.name,
          email: company.email,
        },
        token
      })        
    } catch (error) {
         console.log(error)
         res.status(404).json({messege:error.messege})
    }
}

export const signIn=async(req,res,next)=>{
    const{email,password}=req.body

    if(!email || !password){
        next("all fields are required")
        return
    }
   try {
      const existCompany=await Companies.findOne({email})
      if(!existCompany){
        next("No user exist !!!")
        return
      }

    const correctPassword= await existCompany.isPasswordCorrect(password)

    if(!correctPassword){
        next("wrong password!try again")
        return
    }

    const company=await Companies.findById(existCompany._id).select("-password")

    const token =await company.createToken()

    res.status(200).send({
        success:true,
        messege:"loggined succesfully",
        user:company,
        token
    })

        
    } catch (error) {
        console.log(error)
        res.status(200).json({messege:messege.error})
    }
}

export const updateCompanyProfile=async(req,res,next)=>{
    const { name, contact, location, profileUrl, about } = req.body;
    if (!name || !location || !about || !contact  ) {
        next("Please Provide All Required Fields");
        return;
      }
      try {
       const id=req.body.user.userId
       console.log(id)
       if(!isValidObjectId(id)){
        next("unauthorized access")
        return
       }

       const updateCompany=await Companies.findByIdAndUpdate(id,
        {
            $set:{
                name,
                contact,
                about,
                location,
                profileUrl
            }
        },
        {new:true})

        if(!updateCompany){
            next("can't update the profile")
            return
        }

        const company=await Companies.findById(updateCompany?._id).select("-password")
        const token=await company.createToken()

        res.status(200).send({
            success:true,
            messege:"Update company profule succesffully",
            company,
            token
        })

        
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
}

export const getCompanyProfile =async(req,res,next)=>{
  try {
    const id=req.body.user.userId
    
    if(!isValidObjectId(id)){
     next("unauthorised access")
     return
    }

   const company=await Companies.findById(id).select("-password")

    if(!company){
      next("not user found ")
      return
    }

    res.status(200).send({
      success: true,
      data: company,
    }) 

  } catch (error) {
    console.log(error)
    res.status(404).json({messege:error.messege})
  }


}

export const getCompanies =async(req,res,next)=>{
    try {
      const { search, sort, location } = req.query;

      //searching 

      const queryObject={}

     
    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

      let queryResult= Companies.find(queryObject).select("-password")
      

      //sorting

      if (sort === "Newest") {
        queryResult = queryResult.sort("-createdAt");
      }
      if (sort === "Oldest") {
        queryResult = queryResult.sort("createdAt");
      }
      if (sort === "A-Z") {
        queryResult = queryResult.sort("name");
      }
      if (sort === "Z-A") {
        queryResult = queryResult.sort("-name");
      }
      
      //pagination
      const page=Number(req.query.page) ||1
      const limit=Number(req.query.limit)||20
      
      
      const skip=(page-1)*limit

      const total = await Companies.countDocuments(queryResult);
      const numOfPage = Math.ceil(total / limit);
  
      
      // queryResult=queryResult.skip(skip).limit(limit)

      queryResult = queryResult.limit(limit * page);

      const companies = await queryResult;
     

      res.status(200)
      .send({
        success:true,
        total,
        numOfPage,
        data:companies,
        page
      })



    } catch (error) {
       console.log(error)
       res.status(404).json({messege:error.messege})
    }
}

export const getCompanyJobListing =async(req,res,next)=>{
        const { search, sort } = req.query;
        const id = req.body.user.userId;

        try {
             
       const queryObject = {};

         if (search) {
           queryObject.location = { $regex: search, $options: "i" };
          }

          let sorting;
          //sorting || another way
          if (sort === "Newest") {
            sorting = "-createdAt";
          }
          if (sort === "Oldest") {
            sorting = "createdAt";
          }
          if (sort === "A-Z") {
            sorting = "name";
          }
          if (sort === "Z-A") {
            sorting = "-name";
          }

          let queryResult = await Companies.findById(id).populate({
            path: "jobPosts",
            options: { sort: sorting },
          });
          const companies = await queryResult;
      
          res.status(200).json({
            success: true,
            companies,
          })
          
        } catch (error) {
          console.log(error);
    res.status(404).json({ message: error.message });
        }
}

export const getCompanyById =async(req,res,next)=>{
  try {
    const {id}=req.params
    
    if(!isValidObjectId(id)){
      next("invalid access")
      return
    }

    const company=await Companies.findById(id).populate({
      path:"jobPosts",
      options:{
        sort:"-_id"
      }
    }).select("-password")

    if(!company){
      next("company not found")
      return
    }

    res.status(200)
    .send({
      success:true,
       data:company
    })



    
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}