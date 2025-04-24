import categoriesSchema from "./categories.schema";
import Categories from "./categories.interface";
import refactorServices from "../refactor.service";
class CategoriesServices {
  getAll = refactorServices.getAll<Categories>(categoriesSchema);
  getOne = refactorServices.getOne<Categories>(categoriesSchema);
  create = refactorServices.create<Categories>(categoriesSchema);
  updateOne = refactorServices.updateOne<Categories>(categoriesSchema);
  deleteOne = refactorServices.deleteOne<Categories>(categoriesSchema);
}
const categoriesServices = new CategoriesServices();
export default categoriesServices;
