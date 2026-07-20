import AsyncHandler from "express-async-handler";
import { uploadMultiFiles } from "../middleware/upload.file.middleware";
import refactorServices from "../refactor.service";
import Products from "./products.interface";
import productsSchema from "./products.schema";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";
import ApiErrors from "../utils/apiErrors";

class ProductsServices {
  getAll = refactorServices.getAll<Products>(productsSchema, "products");
  getOne = refactorServices.getOne<Products>(productsSchema, "reviews");
  createOne = refactorServices.create<Products>(productsSchema);
  deleteOne = refactorServices.deleteOne<Products>(productsSchema);
  updateOne = refactorServices.updateOne<Products>(productsSchema);

  uploadCoverAndImages = uploadMultiFiles(
    ["image"],
    [
      { name: "cover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ],
  );

  saveImage = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.files) {
        // Upload cover image → uploads/products
        if ((req.files as any).cover) {
          const filename = `product-${Date.now()}-cover`;
          const url = await uploadToCloudinary(
            (req.files as any).cover[0].buffer,
            "products",
            filename,
          );
          req.body.cover = url;
        }

        // Upload extra product images → uploads/products
        if ((req.files as any).images) {
          req.body.images = [];
          await Promise.all(
            (req.files as any).images.map(async (image: any, index: number) => {
              const filename = `product-${Date.now()}-image-N${index}`;
              const url = await uploadToCloudinary(
                image.buffer,
                "products",
                filename,
              );
              req.body.images.push(url);
            }),
          );
        }
      }
      next();
    },
  );
  addPriceAfterDiscount = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await productsSchema.findById(req.params.id);
      if (!product) {
        return next(new ApiErrors("Item not found", 404));
      }
      const { priceAfterDiscount } = req.body;
      if (priceAfterDiscount > product.price ) {
        return next(
          new ApiErrors(
            "لازالة الخصم قم بوضع سعر المنتج فقط",
            400,
          ),
        );
      }
      if (priceAfterDiscount <= product.price/2 ) {
        return next(
          new ApiErrors(
            "اعلي قيمة للخصم ممكن وضعها هي نصف سعر المنتج",
            400,
          ),
        );
      }
      if (priceAfterDiscount < 0) {
        return next(
          new ApiErrors("قيمة الخصم يجب ان تكون اكبر من 0  ", 400),
        );
      }
      const discount = Math.floor(((product.price - priceAfterDiscount) / product.price) * 100);
      const updated = await productsSchema.findByIdAndUpdate(
        req.params.id,
        {
          priceAfterDiscount: priceAfterDiscount,
          discount: discount
        },
        { new: true, runValidators: true },
      );
      res.status(200).json({ data: updated });
    },
  );
}

const productsServices = new ProductsServices();
export default productsServices;
