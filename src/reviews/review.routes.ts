import { Router } from "express";
import reviewsServices from "./review.service";
import authenticationServices from "../authentication/auth.service";
import reviewsValidation from "./review.validation";

const ReviewsRouter = Router({ mergeParams: true });

ReviewsRouter.route("/").get(
  reviewsServices.FilterData,
  reviewsServices.getAll
);

ReviewsRouter.route("/:id").get(
  reviewsValidation.getOne,
  reviewsServices.getOne
);

ReviewsRouter.use(
  authenticationServices.protectedRoutes,
  authenticationServices.checkActive
);

ReviewsRouter.route("/me").get(
  authenticationServices.allowedTo("user"),
  reviewsServices.getUserReiviews
);

ReviewsRouter.route("/").post(
  authenticationServices.allowedTo("user"),
  reviewsServices.setIds,
  reviewsValidation.createOne,
  reviewsServices.create
);

ReviewsRouter.route("/:id")
  .put(
    authenticationServices.allowedTo("user", "admin", "employee"),
    reviewsServices.setIds,
    reviewsValidation.update,
    reviewsServices.updateOne
  )
  .delete(
    authenticationServices.allowedTo("user", "admin", "employee"),
    reviewsValidation.deleteOne,
    reviewsServices.deleteOne
  );

export default ReviewsRouter;
