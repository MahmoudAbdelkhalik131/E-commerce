import { Router } from "express";
import wishListServices from "./wishlist.service";
import wishListValidation from "./wishlist.valid";
import authenticationServices from "../authentication/auth.service";
const wishListRouter=Router()
wishListRouter.use(authenticationServices.protectedRoutes, authenticationServices.checkActive);
wishListRouter.route('/')
.get(wishListServices.getWishList)
.post(wishListValidation.addToListValid,wishListServices.addToWishList)
wishListRouter.route('/:productId')
.delete(wishListValidation.removeFromWishList,wishListServices.removeFromWishList)
export default wishListRouter