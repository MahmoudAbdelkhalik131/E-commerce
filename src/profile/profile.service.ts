import AsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import refactorServices from "../refactor.service";
import { NextFunction,Request, Response} from "express";
import usersSchema from "../users/users.schema";
import Users from "../users/users.interface";
import { uploadMultiFiles, uploadSingleFile } from "../middleware/upload.file.middleware";
import sharp from "sharp";
import ApiErrors from "../utils/apiErrors";
import sanatization from "../utils/sanatization";
import Token from "../utils/create.token";

class ProfileServices {
  setUserID=AsyncHandler((req:Request,res:Response,next:NextFunction)=>{
    if(req.user){
      req.params.id=req.user._id!.toString()
    }
    next()
  })
  getOne = refactorServices.getOne<Users>(usersSchema);
  deleteOne = refactorServices.deleteOne<Users>(usersSchema);
  updateOne = AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      const user=await usersSchema.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        image:req.body.image,
        username:req.body.username
      },{new:true})
    res.status(200).json({data:sanatization.User(user)})
  })
  createPassword=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user=await usersSchema.findOneAndUpdate({_id:req.user?._id,hasPassword:false},{
      password:await bcrypt.hash(req.body.password,11)
    },{new:true})
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:sanatization.User(user)})
    })
  changePassword=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const user:Users|null=await usersSchema.findByIdAndUpdate(req.user?._id,{
    password:await bcrypt.hash(req.body.password,11),
    passwordChangedAt:Date.now()
  },{new:true})
  const token=Token.createToken(user?._id,user?.role!)
  if(!user) return next(new ApiErrors(`${req.__('invalid_login')}`,401))
  res.status(200).json({data:sanatization.User(user),token})
  })
  uploadImage=uploadMultiFiles(['image'],[{name:'image',maxCount:1}])
  saveImage=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    if(req.files.image){
      const fileName=`user-${Date.now()}-image.webp`
      await sharp(req.files.image[0].buffer)
      .webp({quality:90})
      .toFile(`uploads/images/users/${fileName}`)
      req.body.image=fileName
    }
    next()
  })
  loogedUser=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    if(req.user?._id){
      req.params.id=(req.user?._id).toString()
    }
    next()
  })
  updateInformation=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    if(req.user?._id){
      const user=await usersSchema.findByIdAndUpdate(req.user?._id,{
        name:req.body.name,
        image:req.body.image,
        username:req.body.username
      },{new:true})
      res.status(200).json({data:sanatization.User(user)})
    }
  }) 
}
const profileServices = new ProfileServices();
export default profileServices;
