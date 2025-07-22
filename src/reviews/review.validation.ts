import { body, param } from "express-validator";
import validatorMiddleware from "../middleware/validation.middleware";
import reviewSchema from "./review.schema";
import { Schema } from "mongoose";


class ReviewsValidation {
  createOne = [
    body("comment")
      .notEmpty()
      .withMessage((val,{ req }) => req.__("validation_field"))
      .isLength({ min: 2, max: 500 })
      .withMessage((val,{ req }) => req.__("validation_length_long")),
      body("rate")
      .notEmpty()
      .withMessage((val,{ req }) => req.__("validation_field"))
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("validation_length_long"))
      ,
      body("product")
      .notEmpty().withMessage((val,{ req }) => req.__("validation_field"))
      .isMongoId().withMessage((val, { req }) => req.__("Invalid Id"))
      .custom(async(val,{req})=>{
        const review= await reviewSchema.findOne({product:val,user:req.user._id});
        if(review){
          throw new Error(req.__("review_already_exists"));
        }
        return true;
      })
      ,
    validatorMiddleware,
  ];
  update = [
    param("id").isMongoId().withMessage((val,{ req }) => req.__("invalid_id")),
    body("comment")
      .optional()
      .isLength({ min: 2, max: 500 })
      .withMessage((val, { req }) => req.__("validation_length_long"))
      ,
      body("rate")
       .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("validation_length_long"))
      ,
    validatorMiddleware,
  ];
  deleteOne = [
    param("id").isMongoId().withMessage((val,{ req }) => req.__("invalid_id")).custom(async(val,{req})=>{
      const review = await reviewSchema.findById(val);
      if(review?.user._id!.toString()!== req.user._id.toString()&& req.user.role!=="admin"){
        throw new Error(req.__("not_authorized"));
      } 
    }),
    validatorMiddleware,
  ];
  getOne = [
    param("id").isMongoId().withMessage("Invaild Id"),
    param("productId").isMongoId().withMessage("Invaild Id"),
    validatorMiddleware,
  ];
}
const reviewsValidation = new ReviewsValidation();
export default reviewsValidation;
