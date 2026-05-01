import AsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import refactorServices from "../refactor.service";
import { NextFunction,Request, Response} from "express";
import usersSchema from "./users.schema";
import Users from "./users.interface";
import { uploadMultiFiles } from "../middleware/upload.file.middleware";
import sanatization from "../utils/sanatization";
import { uploadToCloudinary } from "../utils/cloudinary";

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
    if((req.files as any).image){
      const filename=`user-${Date.now()}-profile`
      const url = await uploadToCloudinary(
        (req.files as any).image[0].buffer,
        'profile',
        filename
      )
      req.body.image=url
    }
    next()
  })
 
}
const usersServices = new UsersServices();
export default usersServices;
