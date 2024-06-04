import jwt from 'jsonwebtoken'

const userAuth=async(req,res,next)=>{
    const authHeader = req?.headers?.authorization;

      if(!authHeader || !authHeader?.startsWith("Bearer")){
        next("authentication failed")
      }

      const token = authHeader?.split(" ")[1];

      try {
       const userToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

       req.body.user={userId:userToken.userId}

       next()
       
      } catch (error) {
          console.log(error)
          next("authentication failed")
      }
}

export default userAuth