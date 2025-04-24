import mongoose from "mongoose";
import Subcategories from "./subcategories.interface";
import { populate } from "dotenv";
import path from "path";
const subCategoriesSchema = new mongoose.Schema<Subcategories>({
    name:{type:String,required:true, trim:true},
    image:{type:String},
    category:{type:mongoose.Types.ObjectId,ref:'categories'}

},{timestamps:true})
subCategoriesSchema.pre<Subcategories>(/^find/,function(next){
  this.populate({path:'category'})
  next()
})
export default mongoose.model<Subcategories>('subcategories',subCategoriesSchema)