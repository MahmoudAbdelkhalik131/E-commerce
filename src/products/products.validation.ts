import { body, param } from "express-validator";
import categoriesSchema from "../categories/categories.schema";
import subcategoriesSchema from "../subcategories/subcategories.schema";
import validatorMiddleware from "../middleware/validation.middleware";
import productsSchema from "./products.schema";

class Productsvalidation {
  //price discont priceAfterDiccount quantity sold rateAvg rating name description
  creat = [
     body('price').notEmpty().withMessage("price required"),
     body('discount').optional(),
     body('priceAfterDiscount').optional(),
     body('quantity').notEmpty().withMessage('quantity is required'),
     body('sold') .optional(),
     body('rateAvg').optional(),
     body('rating').optional(),
    body("name").notEmpty().withMessage("name is required"),
     body('description').notEmpty().withMessage('des is required'),
    body("category")
      .notEmpty()
      .withMessage("category is required")
      .isMongoId()
      .withMessage("Invalid Id")
      .custom(async (val) => {
        const category = categoriesSchema.findById(val);
        if (!category) throw new Error("Catgory DoesNot exits");
        return true;
      }),
    body("subcategory")
      .notEmpty()
      .withMessage("subcategory is required")
      .isMongoId()
      .withMessage("Invalid Id")
      .custom(async (val, { req }) => {
        const subcategory = await subcategoriesSchema.findById(val);
        if (!subcategory) throw new Error("Subcategory doesn't exit");
        if (
          subcategory.category._id.toString() !== req.body.category.toString()
        )
          throw new Error("subcategory doesn't exit in that category");
        return true;
      }),
    validatorMiddleware,
  ];
  updateOne = [
    body("price").optional(),
    body("discount").optional(),
    body("priceAfterDiscount").optional(),
    body("quantity").optional(),
    body("sold").optional(),
    body("rateAvg").optional(),
    body("rating").optional(),
    body("name").optional(),
    body("description").optional(),
    body("category")
      .optional()
      .isMongoId()
      .withMessage("Invalid Id")
      .custom(async (val, { req }) => {
        const product = await productsSchema.findById(req.params?.id);
        const category = await categoriesSchema.findById(val);
        if (!category) throw new Error("Catgory DoesNot exits");
        if (
          category._id.toString() !==
          product?.subcategory.category._id.toString()
        )
          throw new Error("subcategory doesn't exit in that category");
        return true;
      }),
      param("id")
      .isMongoId()
      .withMessage("Product not found"),
    body("subcategory").optional().isMongoId().withMessage("Invalid Id")
      .custom(async (val, { req }) => {
        const product = await productsSchema.findById(req.params?.id);
        const subcategory = await subcategoriesSchema.findById(val);
        if (!subcategory) throw new Error("Subcategory doesn't exit");
        if (
          subcategory.category._id.toString() !==
          product?.category._id.toString()
        )
          throw new Error("subcategory doesn't exit in that category");
        return true;
      }),
    validatorMiddleware,
  ];
  deleteOne=[
    param('id').isMongoId().withMessage('Invalid Id')
    .custom(async (val, { req }) => {
        const product = await productsSchema.findById(req.params?.id);
        if (!product) throw new Error("Product DoesNot exits")
        }),validatorMiddleware
  ]
  getOne=[
    param('id').isMongoId().withMessage("Invalid Id")
    .custom(async(val)=>{
        const product=await productsSchema.findById(val)
        if(!product) throw new Error("Product doesn't exit")
        return true
    })
  ]
}
const productsValidation = new Productsvalidation();
export default productsValidation;
