import mongoose from "mongoose";
import Carts from "./cart.interface";
const CartSchema=new mongoose.Schema<Carts>({
    items:[{
      product:{type:mongoose.Schema.Types.ObjectId,ref:'products'},
      quantity:Number,
      price:Number
    }],
    totelPrice:{type:Number},
    totelPriceAfterDiscount:{type:Number},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
},{timestamps:true})
CartSchema.pre<Carts>(/^find/,function(next){
this.populate({path:'items.product',select:"name cover"})
next()
})
const cartSchema=mongoose.model('carts',CartSchema)
export default cartSchema