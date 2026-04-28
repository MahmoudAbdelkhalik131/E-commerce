import { Router } from "express";
import ordersServices from "./order.services";
import authenticationServices from "../authentication/auth.service";
import orderValidation from "./order.validation";

const orderRouter = Router();
orderRouter
  .route("/")
  .post(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("user"),
    orderValidation.createOrder,
    ordersServices.createOrderCash,
  )
  .get(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("admin", "employee", "user"),
    ordersServices.filterData,
    ordersServices.getAll,
  );
 
orderRouter
  .route("/:id/deliver")
  .patch(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("admin","employee"),
    orderValidation.DelviverOrder,
    ordersServices.deliverOrder
  );
orderRouter
  .route("/:id/pay")
  .patch(
    authenticationServices.protectedRoutes,
    authenticationServices.checkActive,
    authenticationServices.allowedTo("admin","employee"),
    orderValidation.PayOrder,
    ordersServices.payOrder
  );

export default orderRouter;
