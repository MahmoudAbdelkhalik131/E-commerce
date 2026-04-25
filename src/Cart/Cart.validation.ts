import { body } from "express-validator";
import productsSchema from "../products/products.schema";
import validatorMiddleware from "../middleware/validation.middleware";

class CartValidation {
  addToCart = [
    body("productId")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
  removeFromCart = [
    body("productId")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
  updateProductQuantity = [
    body("productId")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    body("quantity")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isInt({ min: 1 })
      .withMessage("quantity must be a positive integer")
      .toInt()
      .custom(async (value, { req }) => {
      const product = await productsSchema.findById(req.body.productId);
      if (!product) throw new Error("There is no such product");
      if (value > product.quantity)
        throw new Error(`quantity must be less than ${product.quantity}`);
      return true;
    }),
    validatorMiddleware,
  ];
}

const cartValidation = new CartValidation();
export default cartValidation;
