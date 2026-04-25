import { NextFunction, Request, Response } from "express";
import refactorServices from "../refactor.service";
import Reviews from "./review.interface";
import ReviewSchema from "./review.schema";
import ApiErrors from "../utils/apiErrors";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";

class ReviewsServices {
  FilterData = (req: Request, res: Response, next: NextFunction) => {
        const filterData: any = {};
        if (req.params.productId) filterData.product = req.params.productId;
        if (!req.params.productId && req.user && req.user.role === 'user') filterData.user = req.user._id
        req.filterById = filterData;
        next();
  };
  setIds(req: Request, res: Response, next: NextFunction) {
        req.body.user = req.user!._id;
        if (!req.body.product) req.body.product = req.params.productId;
        next();
    };
  getAll = refactorServices.getAll<Reviews>(ReviewSchema, "reviews");
  getOne = refactorServices.getOne<Reviews>(ReviewSchema);
  create = refactorServices.create<Reviews>(ReviewSchema);
  updateOne = refactorServices.updateOne<Reviews>(ReviewSchema);
  deleteOne = refactorServices.deleteOne<Reviews>(ReviewSchema);
  getUserReiviews = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const reviews=await ReviewSchema.find({user:req.user?._id})
    res.status(200).json({data:reviews,lenght:reviews.length})
  })
}
const reviewsServices = new ReviewsServices();
export default reviewsServices;
