import Products from "../products/products.interface";
import Users from "../users/users.interface";
import { Document } from "mongoose";
export interface CartItems{
    product:Products;
    price:number;
    quantity:number;

}
interface Carts extends Document{
    items:CartItems[];
    totelPrice:number;
    taxPrice:number;
    totelPriceAfterDiscount:number;
    user:Users;
}
export default Carts