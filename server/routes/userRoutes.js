import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { getUser, userUpdateProfile } from '../controllers/userController.js'

  const router=express.Router()
  router.post("/get-user",userAuth,getUser)

  router.put("/update-user",userAuth,userUpdateProfile)
  
  export default router