import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongodb connected on host: ${dbConnection.connection.host } `)
        
    } catch (error) {
         console.log("mongodb connection failed",error)
         process.exit(1)
    }
}

export default connectDB