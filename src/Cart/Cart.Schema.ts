import mongoose from "mongoose";
import Carts from "./cart.interface";
const CartSchema=new mongoose.Schema<Carts>({
    items:[{
      product:{type:mongoose.Schema.Types.ObjectId,ref:'products'},
      quantity:{type:Number ,default:1},
      price:Number
    }],
    totelPrice:{type:Number},
    totelPriceAfterDiscount:{type:Number},
    taxPrice:{type:Number},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
},{timestamps:true})
CartSchema.pre<Carts>(/^find/,function(next){
this.populate({path:'items.product',select:"name cover quantity"})
next()
})
const cartSchema=mongoose.model('carts',CartSchema)
export default cartSchema