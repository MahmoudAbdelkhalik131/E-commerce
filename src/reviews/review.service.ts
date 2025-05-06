import { NextFunction,Request,Response } from "express";
import refactorServices from "../refactor.service";
import Reviews from "./review.interface";
import ReviewSchema from "./review.schema";
import ApiErrors from "../utils/apiErrors";
import mongoose from "mongoose";

class ReviewsServices {
    setIds=(req:Request,res:Response,next:NextFunction)=>{
       if(req.user){
        req.body.user=req.user
       }
       else if(!req.user){
        return next(new ApiErrors(`${req.__('check_login')}`,400))
       }
       if(req.params.productId){
        req.body.product=req.params.productId
       }
       else if(!req.params.productId){
        return next(new ApiErrors(`${req.__('not_found')}`,400))
       }
       next()
    }
    getProductReviews(req:Request,res:Response,next:NextFunction){
        let getProduct:any={}; 
        if(req.params.productId){
            getProduct.product=req.params.productId.toString()
        }
        req.filterById=getProduct
        next()
    }
    getUserReviews(req:Request,res:Response,next:NextFunction){
        let getUser:any={}; 
        if(req.user){
            getUser.user=req.user
        }
        req.filterById=getUser
        next()
    }
    getAll=refactorServices.getAll<Reviews>(ReviewSchema,'reviews')
    getOne=refactorServices.getOne<Reviews>(ReviewSchema)
    create=refactorServices.create<Reviews>(ReviewSchema)
    updateOne=refactorServices.updateOne<Reviews>(ReviewSchema)
    deleteOne=refactorServices.deleteOne<Reviews>(ReviewSchema)
}
const reviewsServices=new ReviewsServices()
export default reviewsServices