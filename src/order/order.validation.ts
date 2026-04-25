import { body, param } from "express-validator";
import orderSchema from "./orders.schema";
import validatorMiddleware from "../middleware/validation.middleware";
import usersSchema from "../users/users.schema";

class OrderValidation {
  createOrder = [
    body("address")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .custom(async (value, { req }) => {
        const user = await usersSchema.findOne({ _id: req.user?._id, "address._id": value });
        if (!user) {
          return Promise.reject(req.__("invalid_address"));
        }
        return true;
      }),
    validatorMiddleware,
  ];
  DelviverOrder = [
    param("id")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
  PayOrder = [
    param("id")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
}

const orderValidation = new OrderValidation();
export default orderValidation;
