import mongoose from "mongoose";
import Reviews from "./review.interface";
const ReviewsSchema=new mongoose.Schema<Reviews>({
    comment:String,
    rate:Number,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'products'}
})
ReviewsSchema.pre<Reviews>(/^find/,function(next){
    this.populate({path:'user',select:'name email'})
    next()
})
ReviewsSchema.pre<Reviews>(/^find/,function(next){
    this.populate({path:'product'})
    next()
})
export default mongoose.model('reviews',ReviewsSchema)