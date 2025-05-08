import AsyncHandler from "express-async-handler";
import { uploadMultiFiles, uploadSingleFile } from "../middleware/upload.file.middleware";
import refactorServices from "../refactor.service";
import Products from "./products.interface";
import productsSchema from "./products.schema";
import { Request,Response,NextFunction } from "express";
import sharp from 'sharp'
class ProductsServices {
  getAll = refactorServices.getAll<Products>(productsSchema, "products");
  getOne = refactorServices.getOne<Products>(productsSchema,'reviews');
  createOne = refactorServices.create<Products>(productsSchema);
  deleteOne = refactorServices.deleteOne<Products>(productsSchema);
  updateOne = refactorServices.updateOne<Products>(productsSchema);
  uploadCoverAndImages=uploadMultiFiles(['image'],[{name:'cover',maxCount:1},{name:'images',maxCount:5}])
  saveImage=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    if(req.files){
      if (req.files.cover){
        const fileName=`product-${Date.now()}-image-.webp`
        await sharp(req.files.cover[0].buffer).webp({quality:99}).resize(1920,1080).toFile(`uploads/images/products/${fileName}`)
        req.body.cover=fileName;
      }
      if(req.files.images){
        req.body.images=[]
        await Promise.all(req.files.images.map(async(image:any,index:number)=>{
          const fileName=`product-${Date.now()}-image-N${index}-.webp`
          await sharp(image.buffer)
          .webp({quality:99}).
          resize(1920,1080).
          toFile(`uploads/images/products/${fileName}`)
          req.body.images.push(fileName);
      }))
      }
    }
    next()
    })
  
}
const productsServices = new ProductsServices();
export default productsServices;
