import Categories from "../categories/categories.interface";
import { Document } from "mongoose";
interface Subcategories extends Document{
    readonly name:string,
    readonly image:string,
    readonly category:Categories
}
export default Subcategories