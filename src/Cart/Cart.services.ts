import AsyncHandler from "express-async-handler";
import Users from "../users/users.interface";
import Cart from "./Cart.Schema";
import { Request, Response, NextFunction } from "express";
import usersSchema from "../users/users.schema";
import cartSchema from "./Cart.Schema";
import ApiErrors from "../utils/apiErrors";
class CartServices {
  createCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartSchema.findOne({ user: req.user!._id });
      if (!cart) {
        return next(new ApiErrors("Your Cart is Empty", 404));
      }
      res.status(200).json({ data: cart });
    }
  );
}
