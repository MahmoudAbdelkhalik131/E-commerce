import AsyncHandler from "express-async-handler";
import Users from "../users/users.interface";
import Cart from "./Cart.Schema";
import { Request, Response, NextFunction } from "express";
import usersSchema from "../users/users.schema";
import cartSchema from "./Cart.Schema";
import ApiErrors from "../utils/apiErrors";
import productsRouter from "../products/products.routes";
import productsServices from "../products/products.services";
import productsSchema from "../products/products.schema";
import { request } from "http";
import Products from "../products/products.interface";
import { CartItems } from "./cart.interface";
class CartServices {
  createCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let cart = await cartSchema.findOne({ user: req.user!._id });
      if (!cart) {
        return next(new ApiErrors("Your Cart is Empty", 404));
      }
      res.status(200).json({ data: cart });
    },
  );
  clearCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart: any = await cartSchema.findOneAndDelete({
        user: req.user?._id,
      });
      res.status(204).json({ message: "Cart Cleared Successfully" });
    },
  );
  addToCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("add to cart called");
      const product: any = await productsSchema.findById({
        _id: req.body.productId,
      });
      if (!product) {
        return next(new ApiErrors(req.__("not_found"), 404));
      }
      console.log("add to cart called2");
      let cart = await cartSchema.findOne({ user: req.user?._id });
      if (!cart) {
        console.log("add to cart called");
        cart = await cartSchema.create({
          user: req.user?._id,
          items: [
            {
              product: product?._id,
              price: product.priceAfterDiscount
                ? product.priceAfterDiscount
                : product.price,
            },
          ],
        });
      } else {
        const Index = cart.items.findIndex((item: any) => {
          return product!._id.toString() === item.product!._id.toString();
        });
        if (Index === -1) {
          cart.items.push({
            product: product?._id,
            price: product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.price,
            quantity: req.body.quantity || 1,
          });
        } else {
          cart.items[Index].quantity += 1;
        }
      }
      cart.totelPrice = this.calculateTotalPRi(cart.items);
      cart.taxPrice = cart.totelPrice * 0.07;
      await cart.save();
      res.status(200).json({ data: cart, lenght: cart.items.length });
    },
  );
  removeFromCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product: any = await productsSchema.findById({
        _id: req.body.productId,
      });
      console.log("remove from cart called");
      if (!product) {
        return next(new ApiErrors(req.__("not_found"), 404));
      }
      let cart = await cartSchema.findOne({ user: req.user?._id });
      if (!cart) {
        return next(new ApiErrors("your cart is empty", 404));
      }
      const Index = cart.items.findIndex((item: any) => {
        return product._id.toString() === item.product._id.toString();
      });
      if (Index === -1) {
        return next(new ApiErrors("There is no such product", 404));
      } else {
        console.log("Index:- ", Index);
        cart.items.splice(Index, 1);
      }
      cart.totelPrice = this.calculateTotalPRi(cart.items);
      cart.taxPrice = cart.totelPrice * 0.07;
      await cart.save();
      res.status(200).json({ data: cart, lenght: cart.items.length });
    },
  );
  updateProductQuantity = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product: any = await productsSchema.findById({
        _id: req.body.productId,
      });
      if (!product) {
        return next(new ApiErrors(req.__("not_found"), 404));
      }
      let cart = await cartSchema.findOne({ user: req.user?._id });
      if (!cart) {
        return next(new ApiErrors("your cart is empty", 404));
      }
      const Index = cart.items.findIndex((item: any) => {
        return product._id.toString() === item.product._id.toString();
      });
      if (Index === -1) {
        return next(new ApiErrors("There is no such product", 404));
      } else {
        cart.items[Index].quantity = req.body.quantity;
      }
      cart.totelPrice = this.calculateTotalPRi(cart.items);
      cart.taxPrice = cart.totelPrice * 0.07;
      await cart.save();

      res.status(200).json({ data: cart, lenght: cart.items.length });
    },
  );
  // applyCoupon = AsyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {

  //   },
  // );
  calculateTotalPRi(items: CartItems[]) {
    const totalPrice = items.reduce<number>((sum: number, item) => {
      sum += item.price * item.quantity;
      return parseFloat(sum.toFixed(2));
    }, 0);
    return totalPrice;
  }
}
const cartServices = new CartServices();
export default cartServices;
