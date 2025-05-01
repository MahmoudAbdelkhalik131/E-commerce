import AsyncHandler from "express-async-handler";
import { NextFunction,Request, Response} from "express";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";
class AddressServices {
  getAddress=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user =await usersSchema.findById(req.user?._id)
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    if(!user.address) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:user.address})
  })
 addAddress=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user =await usersSchema.findByIdAndUpdate({_id:req.user?._id},{
      $addToSet:{address:req.body.address}
    },{new:true})
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:user.address})
  })
  removeAddress=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user =await usersSchema.findByIdAndUpdate(req.user?._id,
        {$pull: {address: {_id: req.params.addressId}}}
    ,{new:true})
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:"Address deleted scussefully"})
  })

}
const addressServices = new AddressServices();
export default addressServices;
