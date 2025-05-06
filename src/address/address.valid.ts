import {  body, param } from "express-validator";
import validationMiddleware from "../middleware/validation.middleware";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";
import Users, { Address } from "../users/users.interface";

class AddressValidation{
    removeAddress=[
        param('addressId').isMongoId().withMessage((req)=>{`${req.__('validation_value')}`}),
        validationMiddleware
    ]
    
}
const addressValidation = new AddressValidation()
export default addressValidation
