import AsyncHandler from "express-async-handler";
import { NextFunction,Request, Response} from "express";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";



class WishListServices {
  getWishList=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.user?._id)
    const user =await usersSchema.findById(req.user?._id).populate('wishlist')
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    if(!user.wishlist) res.status(200).json({message:"WishList is empty"})
    res.status(200).json({data:user.wishlist})
  })
 addToWishList=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    console.log('first')
    const user =await usersSchema.findByIdAndUpdate(req.user?._id,{
      $addToSet:{wishlist:req.body.productId}
    },{new:true}).populate('wishlist')
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:user.wishlist})
  })
  removeFromWishList=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user =await usersSchema.findByIdAndUpdate({_id:req.user?._id},{
      $pull:{wishlist:req.params.productId}
    },{new:true}).populate('wishlist')
    if(!user) return next(new ApiErrors(`${req.__('not_found')}`,404))
    res.status(200).json({data:user.wishlist})
  })

}
const wishListServices = new WishListServices();
export default wishListServices;
