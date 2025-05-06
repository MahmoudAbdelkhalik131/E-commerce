import { Router } from "express";
import reviewsServices from "./review.service";
import authenticationServices from "../authentication/auth.service";
import reviewsValidation from "./review.validation";
const ReviewsRouter=Router({mergeParams:true})
ReviewsRouter.route('/')
.get(reviewsServices.getProductReviews,reviewsServices.getAll)
ReviewsRouter.use(authenticationServices.protectedRoutes,authenticationServices.checkActive)
ReviewsRouter.route('/me')
.get(authenticationServices.allowedTo('user'),reviewsServices.getUserReviews,reviewsServices.getAll)
ReviewsRouter.route('/')
.post(authenticationServices.allowedTo('user'),reviewsServices.setIds,reviewsValidation.createOne,reviewsServices.create)
ReviewsRouter.route('/:id')
.get(authenticationServices.allowedTo('user'),reviewsValidation.getOne,reviewsServices.getOne)
.put(authenticationServices.allowedTo('user','admin','employee'),reviewsServices.setIds,reviewsValidation.updateOne,reviewsServices.updateOne)
.delete(authenticationServices.allowedTo('user','admin','employee'),reviewsValidation.deleteOne,reviewsServices.deleteOne)
ReviewsRouter.route('/:productId/reviews')
.post(authenticationServices.allowedTo('user'),reviewsServices.setIds,reviewsValidation.createOne,reviewsServices.create)
.get(authenticationServices.allowedTo('user'),reviewsServices.setIds,reviewsValidation.getOne,reviewsServices.getOne)
export default ReviewsRouter