import { body, param } from "express-validator";
import categoriesSchema from "./categories.schema";
import validatorMiddleware from "../middleware/validation.middleware";


class CategoriesValidation {
  createOne = [
    body("name")
      .notEmpty()
      
      .withMessage((val,{ req }) => req.__("validation_field"))
      .isLength({ min: 2, max: 20 })
      .withMessage("Invalid Lenght")
      .custom(async (val) => {
        const category = await categoriesSchema.findOne({ name: val });
        if (!category) return true;
        else throw new Error("category already exits");
      }),
    validatorMiddleware,
  ];
  updateOne = [
    param("id").isMongoId().withMessage("Incorrect Id"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("validation_name"))
      .custom(async (val,{req}) => {
        const category = await categoriesSchema.findOne({name:val});
        if (category && category._id.toString() !== req.params?.id)
          throw new Error("Category Name already exits");
        return true;
      }),
    validatorMiddleware,
  ];
  deleteOne = [
    param("id").isMongoId().withMessage("You can't delete what doesn't exit"),
    validatorMiddleware,
  ];
  getOne = [
    param("id").isMongoId().withMessage("Invaild Id"),
    validatorMiddleware,
  ];
}
const categoriesValidation = new CategoriesValidation();
export default categoriesValidation;
