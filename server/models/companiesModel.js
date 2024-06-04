import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const companySchema=new Schema({
    name:{
        type:String,
        required:[true,"Company name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        validate:validator.isEmail,
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength: [6, "Password must be at least"],
        select: true,
    },
   
    profileUrl:{
        type:String
    },
    contact:{
        type:String,
       
    },
    location:{
        type:String
    },
    about:{
        type:String
    },
    jobPosts:[{
        type:Schema.Types.ObjectId,
        ref:"Jobs"
    }]
},{timestamps:true})


//password should be encrypted before save the document in database
companySchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

   this.password=  await bcrypt.hash(this.password,10)
   next()
})

//compare password

companySchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

//create access token

companySchema.methods.createToken=async function(){
     return jwt.sign(
        {
            userId:this._id,
            firstName:this.firstName,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
     )
}

export const Companies=mongoose.model("Companies",companySchema)
