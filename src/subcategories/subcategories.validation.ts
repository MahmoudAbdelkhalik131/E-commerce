import { body, param } from "express-validator";
import subcategoriesSchema from "./subcategories.schema";
import categoriesSchema from "../categories/categories.schema";
import validatorMiddleware from "../middleware/validation.middleware";

class SubcategoriesValidation{
    creatOne=[
        body('name').notEmpty().withMessage('subcategories name is required')
        .isLength({min:3,max:20}).withMessage("Invalid Length")
        ,body('category').isMongoId().withMessage("Invalid category id")
        .custom(async(val)=>{
            const category=await categoriesSchema.findById(val)
            if(!category) throw new Error("wrong category Id")
        }),
    validatorMiddleware
    ];
    updateOne=[
        body('name').optional().isLength({min:2,max:20}).withMessage("Invalid Length"),
        param('id').isMongoId().withMessage("Invalid Id"),
        body('category').optional().isMongoId().withMessage("Invalid Id")
        .custom(async(val)=>{
           const category=await categoriesSchema.findById(val)
           if(!category) throw new Error('Wrong category Id')
            return true
        }),
        validatorMiddleware
    ];
    getOne=[
        param('id').isMongoId().withMessage('Invalid Id')
        .custom(async(val)=>{
            const subcategory=await subcategoriesSchema.findById(val)
            if(!subcategory) throw new Error('Wrong category Id')
             return true
         }),validatorMiddleware
    ];
    deleteOne=[
        param('id').isMongoId().withMessage('Invalid Id')
        .custom(async(val)=>{
            const subcategory=await subcategoriesSchema.findById(val)
            if(!subcategory) throw new Error('Wrong category Id')
             return true
         }),validatorMiddleware
    ];
}
const subcategoriesValidation=new SubcategoriesValidation()
export default subcategoriesValidation