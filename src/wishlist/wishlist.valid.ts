import { body, param } from "express-validator";
import validationMiddleware from "../middleware/validation.middleware";

class WishListValidation{
    addToListValid=[
        body('productId').isMongoId().withMessage((req)=>{`${req.__('validation_value')}`}),
        validationMiddleware
    ]
    removeFromWishList=[
        param('productId').isMongoId().withMessage((req)=>{`${req.__('validation_value')}`}),
        validationMiddleware
    ]
}
const wishListValidation = new WishListValidation()
export default wishListValidation
