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
  ];
  removeFromCart = [
    body("productId")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
  ];
  updateProductQuantity = [
    body("productId")
      .notEmpty()
      .withMessage((value, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((value, { req }) => req.__("invalid_id")),
    body("quantity").custom(async (value, { req }) => {
      if (value < 1) throw new Error("quantity must be greater than 0");
      const product = await productsSchema.findById({
        _id: req.body.productId,
      });
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
