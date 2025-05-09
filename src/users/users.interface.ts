import mongoose, { Document } from "mongoose"
interface Users extends Document{
        [x: string]: any;
        readonly username: string;
        readonly email: string;
        readonly name: string;
        password: string;
        readonly role: Role;
        readonly active: boolean;
        googleId:string;
        address: Address[];
        wishList:mongoose.Schema.Types.ObjectId[];
        hasPassword: boolean;
        passwordChangedAt: Date | number;
        passwordResetCode: string | undefined;
        passwordResetCodeExpires: Date | number | undefined;
        passwordResetCodeVerify: boolean | undefined;
        image: string;
    }
type Role = "admin" | "employee" | "user";

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export default Users