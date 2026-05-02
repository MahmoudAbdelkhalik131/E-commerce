import { NextFunction, Request, Response } from "express";
import refactorServices from "../refactor.service";
import { Orders } from "./orders.interface";
import ordersSchema from "./orders.schema";
import AsyncHandler from "express-async-handler";
import cartSchema from "../Cart/Cart.Schema";
import ApiErrors from "../utils/apiErrors";
import productsSchema from "../products/products.schema";
class OrdersServices {
  filterData = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "user") req.filterById ={user:req.user._id};
    next();
  };
  getAll = refactorServices.getAll<Orders>(ordersSchema);
  getOne = refactorServices.getOne<Orders>(ordersSchema,"items.product");
  createOrderCash = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new ApiErrors(req.__("check_login"), 404));
      }
      const cart = await cartSchema.findOne({ user: req.user?._id });
      if (!cart) {
        return next(new ApiErrors("Cart is empty", 404));
      }
      const itemsPrice: number = Number(
        cart.totelPriceAfterDiscount != null
          ? cart.totelPriceAfterDiscount
          : cart.totelPrice
      ) || 0;
      const taxPrice = Number(cart.taxPrice) || 0;
      const order = await ordersSchema.create({
        user: req.user._id,
        items: cart.items,
        itemsPrice: itemsPrice,
        totalPrice: itemsPrice + taxPrice,
        address: req.body.address,
        taxPrice: taxPrice,
      });
      const bulkupdate = cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      }));
      await productsSchema.bulkWrite(bulkupdate);
      await cartSchema.deleteOne({ user: req.user._id });
      res.status(201).json({ data: order });
    },
  );
  payOrder = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isPaid: true,
          paidAt: Date.now(),
        },
        { new: true },
      );
      res.status(200).json({ success: true });
    },
  );
  deliverOrder = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isDelivered: true,
          deliveredAt: Date.now(),
        },
        { new: true },
      );
      res.status(200).json({ success: true });
    },
  );
}
const ordersServices = new OrdersServices();
export default ordersServices;
