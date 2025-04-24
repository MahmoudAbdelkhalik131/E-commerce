import { Router } from "express";
import subCategoriesServices from "./subcategories.services";
import subcategoriesValidation from "./subcategories.validation";
import authenticationServices from "../authentication/auth.service";
const subCategoriesRouter = Router({mergeParams:true});
subCategoriesRouter
  .route("/")
  .get(subCategoriesServices.filterSubcategories,subCategoriesServices.getAll)
  .post(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),subCategoriesServices.setCategoryId,subcategoriesValidation.creatOne,subCategoriesServices.createOne);
subCategoriesRouter
  .route("/:id")
  .get(subcategoriesValidation.getOne,subCategoriesServices.getOne)
  .put(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),subcategoriesValidation.updateOne,subCategoriesServices.updateOne)
  .delete(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),subcategoriesValidation.deleteOne,subCategoriesServices.deleteOne);

export default subCategoriesRouter
