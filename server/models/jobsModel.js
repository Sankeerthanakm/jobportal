import mongoose, { Schema } from "mongoose";


const jobSchema= new Schema({
    company:{
        type:Schema.Types.ObjectId,
        ref:"Companies"
    },
    jobTitle:{
        type:String,
        required:[true,"job title is required"]
    },
    jobType:{
        type:String,
        required:[true,"job Type is required"]
    },
    salary:{
        type:Number,
        required:true
    },
    vaccancy:{
        type:Number
    },
    location:{
        type:String,
        required:[true,"location is required"]
    },
    experience:{
        type:Number,
        default:0
    },
    detail:[
        {
            desc:{
                type:String
            },
            requirements:{
                type:String
            }
        }
    ],
    application:[
        {
            type:Schema.Types.ObjectId,
            ref:"Users"
        }
    ]
       

},{timestamps:true})

export const Jobs=mongoose.model("Jobs",jobSchema)