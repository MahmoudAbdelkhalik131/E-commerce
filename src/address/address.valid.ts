import {  param } from "express-validator";
import validationMiddleware from "../middleware/validation.middleware";

class AddressValidation{
    removeAddress=[
        param('addressId').isMongoId().withMessage((req)=>{`${req.__('validation_value')}`}),
        validationMiddleware
    ]
}
const addressValidation = new AddressValidation()
export default addressValidation
