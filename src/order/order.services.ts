import { NextFunction, Request, Response } from "express";
import refactorServices from "../refactor.service";
import { Orders } from "./orders.interface";
import ordersSchema from "./orders.schema";
import AsyncHandler from "express-async-handler";
import cartSchema from "../Cart/Cart.Schema";
import ApiErrors from "../utils/apiErrors";
import productsSchema from "../products/products.schema";
import usersSchema from "../users/users.schema";
class OrdersServices {
  filterData = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "user") req.filterById = { user: req.user._id };
    next();
  };
  getAll = refactorServices.getAll<Orders>(ordersSchema);
  getOne = refactorServices.getOne<Orders>(ordersSchema);
  createOrderCash = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new ApiErrors(req.__("check_login"), 404));
      }
      const cart = await cartSchema.findOne({ user: req.user?._id });
      if (!cart) {
        return next(new ApiErrors(req.__("السلة فارغة"), 404));
      }

      // Fetch user to lookup the address details using the ID
      const user = await usersSchema.findById(req.user._id);
      if (!user || !user.address) {
        return next(new ApiErrors("User or addresses not found", 404));
      }

      const selectedAddress = user.address.find(
        (addr: any) => addr._id.toString() === req.body.address
      );
      if (!selectedAddress) {
        return next(new ApiErrors("Address not found", 404));
      }

      const itemsPrice: number = Number(
        cart.totelPriceAfterDiscount != null
          ? cart.totelPriceAfterDiscount
          : cart.totelPrice
      ) || 0;

      let taxPrice = Number(cart.taxPrice) || 0;
      if (selectedAddress.state === "محافظة الشرقية") {
        taxPrice = 0;
      }

      const order = await ordersSchema.create({
        user: req.user._id,
        items: cart.items,
        itemsPrice: itemsPrice,
        totalPrice: itemsPrice + taxPrice,
        DepositeAmount: itemsPrice * 0.5,
        address: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
        },
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
  getAddress=AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const document = await ordersSchema.findById(req.params.id);
      if (!document) {
        return next(new ApiErrors(`${req.__('not_found')}`, 404));
      }
      res.status(200).json({ data: document.address });
    }
  )
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
  depositePaid = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isDepositePaid: true,
          DepositePaidAt: Date.now(),
        },
        { new: true },
      );
      res.status(200).json({ success: true });
    },
  );
}
const ordersServices = new OrdersServices();
export default ordersServices;
