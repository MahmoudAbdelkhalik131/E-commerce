import AsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Subcategories from "./subcategories.interface";
import subcategoriesSchema from "./subcategories.schema";
import refactorServices from "../refactor.service";
class SubCategoriesServices {
  filterSubcategories = (req: Request, res: Response, next: NextFunction) => {
    const filterSubcategoryUsingCategory: any = {};
    if (req.params.categoryId) {
      filterSubcategoryUsingCategory.category = req.params.categoryId;
    }
    req.filterSubcategoryUsingCategory = filterSubcategoryUsingCategory;
    next();
  };
  setCategoryId = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.categoryId && !req.body.category)
      req.body.category = req.params.categoryId;
    next();
  };
  getAll = refactorServices.getAll<Subcategories>(subcategoriesSchema);
  getOne = refactorServices.getOne<Subcategories>(subcategoriesSchema);
  createOne = refactorServices.create<Subcategories>(subcategoriesSchema);
  updateOne = refactorServices.updateOne<Subcategories>(subcategoriesSchema);
  deleteOne = refactorServices.deleteOne<Subcategories>(subcategoriesSchema);
}

const subCategoriesServices = new SubCategoriesServices();
export default subCategoriesServices;
