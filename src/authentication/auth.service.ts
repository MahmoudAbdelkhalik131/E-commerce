import { NextFunction, Request, Response } from "express"

// Extend the Request interface to include the correct user type
// declare global {
//   namespace Express {
//     interface Request {
//       user?: Users;
//     }
//   }
// }
import AsyncHandler from "express-async-handler"
import usersSchema from "../users/users.schema"
import Users from "../users/users.interface"
import crypto from'crypto'
import bcrypt from "bcryptjs"
import ApiErrors from "../utils/apiErrors"
import token from "../utils/create.token"
import Jwt from "jsonwebtoken"
import sendEmail from "../utils/sendMail"
import Token from "../utils/create.token"
import { Console } from "console"


class AuthenticationServices {
login=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user:Users|null = await usersSchema.findOne({email:req.body.email})
    if(!user|| !(await bcrypt.compare(req.body.password,user.password)))
         return next (new ApiErrors("Invalid Email Or Password",401))
    const Token =  token.createToken(user._id,user.role)
    res.status(200).json({data:user,token:Token})
      
})
sginUp=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user:Users =await usersSchema.create(req.body)
    user.password=await bcrypt.hash(user.password,15)
    res.status(200).json({data:user})
})
protectedRoutes=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    let token:string=''
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
    }
    else{
        return next( new ApiErrors("Please Login first",401))
    }
    const decodedToken:any= Jwt.verify(token,process.env.JWT_KEY!)
    // console.log(token)
    const user=await usersSchema.findById(decodedToken._id)

    if(!user) 
        return next(new ApiErrors("sign UP First",404))
    if(user.passwordChangedAt instanceof Date)
    {
        let changeTime=parseInt(((user.passwordChangedAt.getTime())/1000).toString())
        if(changeTime>decodedToken.iat) 
            return next(new ApiErrors("logIn Again you or Your manager changed Your Password",401))
    }
    req.user=user
    next()
    
})
checkActive=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    if(!req.user?.active)
         return next(new ApiErrors("You are not Active",403))
    next()
})
allowedTo=(...roles:string[])=> AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
        
       if(!roles.includes(req.user?.role!))
          return next(new ApiErrors("You are not authorized to do that",403))
        next()
    })
verifyCode=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    let token:string=''
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
    }
    else{
        console.log("1111")
        return next(new ApiErrors(`${req.__('check_login')}`,403))
    }
    const decodedToken:any=Jwt.verify(token,process.env.JWT_RESET_KEY!)
   ;
    
    const user:Users|null=await usersSchema.findOne({
        // _id:decodedToken._id,
        passwordResetCode:  crypto.createHash('sha256').update(req.body.resetcode).digest("hex"),
        // passwordResetCodeExpires:{$gt:Date.now()}
    })
   if(!user) return next (new ApiErrors(`${req.__('check_login check_code_valid')}`,403))
  user.passwordResetCodeVerify=true
   if(user.image&&(user.image.startsWith(`${process.env.BASE_URL}`)))
    user.image!= user.image.split('/').pop()
user.save({validateModifiedOnly:true})
})
forgetPassword=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user:Users|null=await usersSchema.findOne({email:req.body.email})
    if(!user) return next(new ApiErrors(`${req.__('check_email')}`,404))
    const resetCode:string=Math.floor(100000+Math.random()*9000000).toString()
    const hashedResetCode:string= crypto.createHash('sha256').update(resetCode).digest('hex')
    const message:string= `your reset code is: ${resetCode}`
    const options={
        message:message,
        email:user.email, 
        subject:'resetcode'
    }
    try{
      await sendEmail(options)
      user.passwordResetCode=hashedResetCode
      user.passwordResetCodeExpires=Date.now()+10*60*1000
      user.passwordResetCodeVerify=false
      if(user.image&&(user.image.startsWith(`${process.env.BASE_URL}`)))
        user.image!= user.image.split('/').pop()
      user.save({validateModifiedOnly:true})
    
    }
    catch(e){
    console.log(e)
     return next(new ApiErrors(`${req.__('send_email')}`,500))
    }
    const token=Token.createRestToken(user._id)
    res.status(200).json({message:"reset code sent successfully",Token:token})
   })
}
const authenticationServices = new AuthenticationServices()
export default authenticationServices