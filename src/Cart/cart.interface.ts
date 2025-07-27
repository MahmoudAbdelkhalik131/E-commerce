import Products from "../products/products.interface";
import Users from "../users/users.interface";
import { Document } from "mongoose";
interface Carts extends Document{
    items:CartItems[];
    readonly totelPrice:number;
    totelPriceAfterDiscount:number;
    user:Users;
}
export interface CartItems{
    product:Products;
    price:number;
    quantity:number;

}
export default Carts