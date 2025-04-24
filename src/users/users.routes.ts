import { Router, } from "express";
import usersServices from "./users.services";
import usersValidation from "./users.validation";
import authenticationServices from "../authentication/auth.service";

const userRouter:Router=Router()
userRouter.use(authenticationServices.protectedRoutes,authenticationServices.checkActive)
userRouter.use(authenticationServices.allowedTo("admin"))
userRouter.route("/")
  .get(usersServices.getAll)
  .post(usersServices.uploadImage,usersServices.saveImage,usersValidation.createOne,usersServices.createOne);
userRouter.route("/:id")
  .get(usersValidation.getOne,usersServices.getOne)
  .put(usersServices.uploadImage,usersServices.saveImage,usersValidation.updateOne,usersServices.updateOne)
  .delete(usersValidation.deleteOne,usersServices.deleteOne);
userRouter.route('/:id/changepassword')
.put(usersValidation.changePassword,usersServices.changePassword)
export default userRouter