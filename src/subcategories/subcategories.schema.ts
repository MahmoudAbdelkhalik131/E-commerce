import mongoose from "mongoose";
import Subcategories from "./subcategories.interface";
import { populate } from "dotenv";
import path from "path";
const subCategoriesSchema = new mongoose.Schema<Subcategories>({
    name:{type:String,required:true, trim:true},
    image:{type:String,default: "https://res.cloudinary.com/dlqfpuwtk/image/upload/v1777906613/Gemini_Generated_Image_glnipjglnipjglni_uv25sy.png"},
    category:{type:mongoose.Types.ObjectId,ref:'categories'}

},{timestamps:true})
subCategoriesSchema.pre<Subcategories>(/^find/,function(next){
  this.populate({path:'category'})
  next()
})
export default mongoose.model<Subcategories>('subcategories',subCategoriesSchema)