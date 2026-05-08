import mongoose from "mongoose";
import Categories from "./categories.interface";
import exp from "constants";
const categoriesSchema=new mongoose.Schema<Categories>({
  name:{type:String, unique:true , trim:true},
  image:{type:String,default: "https://res.cloudinary.com/dlqfpuwtk/image/upload/v1777906613/Gemini_Generated_Image_glnipjglnipjglni_uv25sy.png"}
},{timestamps:true})
export default mongoose.model<Categories>('categories',categoriesSchema)