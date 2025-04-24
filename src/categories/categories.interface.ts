import { Document } from "mongoose"
interface Categories extends Document{
    _id: any
    readonly name:string,
    image:string
}
export default Categories