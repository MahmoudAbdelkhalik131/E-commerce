import AsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import cartSchema from "./Cart.Schema";
import ApiErrors from "../utils/apiErrors";
import productsSchema from "../products/products.schema";
import Carts, { CartItems } from "./cart.interface";
class CartServices {
  createCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let cart: any = await cartSchema.findOne({ user: req.user!._id });
      if (!cart) {
        res
          .status(200)
          .json({ data: { items: [], totelPrice: 0, taxPrice: 0 } });
      }
      cart.totelPrice = this.calculateTotalPRi(cart.items);
      cart.taxPrice = cart.totelPrice * 0.07;
      await cart.save();
      res.status(200).json({ data: cart });
    },
  );
  clearCart = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await cartSchema.findOneAndDelete({
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
              quantity: req.body.quantity || 1,
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
          const addQty = Number(req.body.quantity) || 1;
          const current = Number(cart.items[Index].quantity) || 1;
          cart.items[Index].quantity = current + addQty;
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
      const product: any = await productsSchema.findById(req.body.productId);
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
      const product: any = await productsSchema.findById(req.body.productId);
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
        const qty = Number(req.body.quantity);
        cart.items[Index].quantity = qty;
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
