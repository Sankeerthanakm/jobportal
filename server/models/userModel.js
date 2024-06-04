import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from "validator";

const userSchema=new Schema({
     firstName:{
        type:String,
        required:[true,"first name is required"]
     },
     lastName:{
        type:String,
        required:[true,"last name is required"]
     },
     email:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail,
        lowercase:true
     },
     password:{
        type:String,
         required:[true,"Password is required"],
         minlength:[6,"password must be 6 characters"]
    },
    accountType:{
        type:String,
        default:"seeker"
    },
    contact:{
        type:String
    },
    location:{
        type:String
    },
    profileUrl:{
        type:String
    },
    jobTitle:{
        type:String
    },
    about:{
        type:String
    }
},{timestamps:true})

//password should be encrypted before save the document in database
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

   this.password=  await bcrypt.hash(this.password,10)
   next()
})

//compare password

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

//create access token

userSchema.methods.createToken=async function(){
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


export const Users=mongoose.model("Users",userSchema)


