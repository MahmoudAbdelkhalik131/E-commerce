import AsyncHandler from "express-async-handler";
import { uploadMultiFiles } from "../middleware/upload.file.middleware";
import refactorServices from "../refactor.service";
import Products from "./products.interface";
import productsSchema from "./products.schema";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";

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
    ]
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
            filename
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
                filename
              );
              req.body.images.push(url);
            })
          );
        }
      }
      next();
    }
  );
}

const productsServices = new ProductsServices();
export default productsServices;
