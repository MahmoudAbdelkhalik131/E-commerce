import mongoose from "mongoose";
import Categories from "./categories.interface";
import exp from "constants";
const categoriesSchema=new mongoose.Schema<Categories>({
  name:{type:String, unique:true , trim:true},
  image:{type:String}
},{timestamps:true})
export default mongoose.model<Categories>('categories',categoriesSchema)