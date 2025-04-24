import { Router,Request,Response,NextFunction } from "express";
import productsServices from "./products.services";
import productsValidation from "./products.validation";
import authenticationServices from "../authentication/auth.service";
const productsRouter: Router = Router();
productsRouter
  .route("/")
  .get(productsServices.getAll)
  .post(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),productsServices.uploadCoverAndImages,productsServices.saveImage,productsValidation.creat,productsServices.createOne);
productsRouter
  .route("/:id")
  .get(productsValidation.getOne,productsServices.getOne)
  .put(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),productsValidation.updateOne,productsServices.updateOne)
  .delete(authenticationServices.protectedRoutes,authenticationServices.checkActive,authenticationServices.allowedTo("admin","employee"),productsValidation.deleteOne,productsServices.deleteOne);
export default productsRouter