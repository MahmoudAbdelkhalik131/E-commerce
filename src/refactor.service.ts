import { Request, Response, NextFunction } from "express";
import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ApiErrors from "./utils/apiErrors";
import Features from "./utils/features";
import sanatization from "./utils/sanatization";
class RefactorServices {
  getAll = <modelType>(model: mongoose.Model<any>,modelName?:string) =>
    AsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
        let filterData:any={}
        if (req.filterById) filterData=req.filterById
        const documentCount=await model.find(filterData).countDocuments()
        const features=new Features( model.find(filterData),req.query).sort().limitFields().search(modelName!).pagination(documentCount)
       const{mongooseQuery,paginationResult}=features
      const documents: modelType[] = await mongooseQuery;
      if (!documents) {
       return next(new ApiErrors(`${req.__('not_found')}`,400))
      }
      res.status(200).json({ pagenation:paginationResult,length:documents.length,data: documents });
    });
  getOne = <modelType>(model: mongoose.Model<any>,populationOption?:string) =>
    AsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
      let query: any =  model.findById(req.params.id)
      if(populationOption) query=query.populate(populationOption)
      const documents: modelType | null =  await query
      if (!documents) {
       return next(new ApiErrors(`${req.__('not_found')}`,400))
      }
      res.status(200).json({ data:documents});
    });
  create = <modelType>(model: mongoose.Model<any>) =>
    AsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
      const documents: modelType = await model.create(req.body);
      if (!documents) {
      return  next(new ApiErrors(`${req.__('not_found')}`,400))
      }
      res.status(200).json({data:sanatization.User(documents)});
    });
  updateOne = <modelType>(model: mongoose.Model<any>) =>
    AsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
      const documents: modelType | null = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!documents) {
       return next(new ApiErrors(`${req.__('not_found')}`,400))
      }
      res.status(200).json({ data:sanatization.User(documents) });
    });
  deleteOne = <modelType>(model: mongoose.Model<any>) =>
    AsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
      const documents= await model.findByIdAndDelete(req.params.id);
      if (!documents) {
       return next(new ApiErrors(`${req.__('not_found')}`,400))
      }
      res.status(204).json("category has been deleted" );
    });
}
const refactorServices = new RefactorServices();
export default refactorServices;
