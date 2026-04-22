import { Router } from "express";
import cartServices from "./Cart.services";
import authenticationServices from "../authentication/auth.service";
import cartValidation from "./Cart.validation";
const cartRouter = Router();
cartRouter
  .route("/")
  .get(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    cartServices.createCart,
  )
  .delete(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    cartServices.clearCart,
  );
cartRouter
  .route("/add")
  .post(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    cartValidation.addToCart,
    cartServices.addToCart,
  );
cartRouter
  .route("/remove")
  .patch(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    cartValidation.removeFromCart,
    cartServices.removeFromCart,
  );
cartRouter
  .route("/update")
  .patch(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    cartValidation.updateProductQuantity,
    cartServices.updateProductQuantity,
  );
export default cartRouter;
