import { Users } from "../models/userModel.js"


export const register=async(req,res,next)=>{
    const {firstName,lastName,email,password}=req.body
    try {

        

        if([firstName,lastName,email,password].some((field)=>field?.trim() ==="")){
               next("all fields are required")
        }

        const userAlreadyExist= await Users.findOne({email})
        if(userAlreadyExist){
            next("user Already exist")
            return;
        }


   const user= await Users.create({
   
      firstName,
      lastName,
      email,
      password
 })

   const token=await user.createToken()

  res.status(200)
  .send(
    {
        success:true,
        messege:"account created succesfully",
        user:{
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            accountType: user.accountType
        },
        token
    }
  )

} catch (error) {
        console.log(error)
        res.status(404).json({messege:error.messege})
    }
}

export const signIn=async(req,res,next)=>{
    const{email,password}=req.body

    try {
        if(!email){
            next("email is required")
        }
        if(!password){
            next("password is required")
        }
    

       const user=await Users.findOne({email }).select("+password")
       if(!user){
        next("no user exist,invalid email and password")
        return
       }

       const isPasswordCorrect= await user.isPasswordCorrect(password)
    
       if(!isPasswordCorrect){
        next("invalid password")
        return
       }

        user.password=undefined

      const token= await user.createToken()
     
      res.status(200)
      .send({
        success:true,
        messege:"loggined successfully",
        user:user,
        token
      })

    } catch (error) {
         console.log(error)
         res.status(404).json({messege:error.messege})
    }
} 