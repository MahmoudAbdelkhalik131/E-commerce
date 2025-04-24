import express from "express";
import categoriesServices from "./categories.services";
import subCategoriesRouter from "../subcategories/subcategories.routes";
import categoriesValidation from "./categories.validation";
import authenticationServices from "../authentication/auth.service";
const categoriesRouter = express.Router();
categoriesRouter.use("/:categoryId/subcategories", subCategoriesRouter);
categoriesRouter
  .route("/")
  .get(categoriesServices.getAll)
  .post(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),categoriesValidation.createOne ,categoriesServices.create);
categoriesRouter
  .route("/:id")
  .get(categoriesValidation.getOne,categoriesServices.getOne)
  .put(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),categoriesValidation.updateOne,categoriesServices.updateOne)
  .delete(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),categoriesValidation.deleteOne,categoriesServices.deleteOne);
export default categoriesRouter;
