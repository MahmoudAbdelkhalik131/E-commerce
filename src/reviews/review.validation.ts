import { body, param } from "express-validator";
import validatorMiddleware from "../middleware/validation.middleware";


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
    validatorMiddleware,
  ];
  updateOne = [
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
    param("id").isMongoId().withMessage((val,{ req }) => req.__("invalid_id")),
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
