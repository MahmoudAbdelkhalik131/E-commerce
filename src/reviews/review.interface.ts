import { Document } from "mongoose";
import Users from "../users/users.interface";
import Products from "../products/products.interface";
interface Reviews extends Document{
   comment:string,
   rate:number,
   user:Users,
   product:Products
   
}
export default Reviews