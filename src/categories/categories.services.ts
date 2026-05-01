import categoriesSchema from "./categories.schema";
import Categories from "./categories.interface";
import refactorServices from "../refactor.service";
import { uploadMultiFiles } from "../middleware/upload.file.middleware";
import AsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";

class CategoriesServices {
  getAll = refactorServices.getAll<Categories>(categoriesSchema);
  getOne = refactorServices.getOne<Categories>(categoriesSchema);
  create = refactorServices.create<Categories>(categoriesSchema);
  updateOne = refactorServices.updateOne<Categories>(categoriesSchema);
  deleteOne = refactorServices.deleteOne<Categories>(categoriesSchema);

  uploadImage = uploadMultiFiles(["image"], [{ name: "image", maxCount: 1 }]);

  saveImage = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && (req.files as any).image) {
      const filename = `category-${Date.now()}`;
      const url = await uploadToCloudinary(
        (req.files as any).image[0].buffer,
        "categories",
        filename
      );
      req.body.image = url;
    }
    next();
  });
}

const categoriesServices = new CategoriesServices();
export default categoriesServices;
