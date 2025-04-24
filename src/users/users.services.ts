import AsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import refactorServices from "../refactor.service";
import { NextFunction,Request, Response} from "express";
import usersSchema from "./users.schema";
import Users from "./users.interface";
import { uploadMultiFiles, uploadSingleFile } from "../middleware/upload.file.middleware";
import sharp from "sharp";
import sanatization from "../utils/sanatization";

class UsersServices {
  getAll = refactorServices.getAll<Users>(usersSchema);
  getOne = refactorServices.getOne<Users>(usersSchema);
  createOne = refactorServices.create<Users>(usersSchema);
  deleteOne = refactorServices.deleteOne<Users>(usersSchema);
  updateOne = AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      const user=await usersSchema.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        image:req.body.image,
        username:req.body.username
      },{new:true})
    res.status(200).json({data:user})
  })
  changePassword=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const user=await usersSchema.findByIdAndUpdate(req.params.id,{
    password:await bcrypt.hash(req.body.password,11)
  },{new:true})
  res.status(200).json({data:sanatization.User(user)})
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
 
}
const usersServices = new UsersServices();
export default usersServices;
