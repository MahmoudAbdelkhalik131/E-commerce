import { Router, } from "express";
import  profileServices from "./profile.service";
import profileValidation from "./profile.validation";
import authenticationServices from "../authentication/auth.service";

const profileRouter:Router=Router()
profileRouter.use(authenticationServices.protectedRoutes,authenticationServices.checkActive)
profileRouter.route('/me')
.get( profileServices.setUserID, profileServices.getOne)
profileRouter.use(authenticationServices.allowedTo("user"))
profileRouter.route('/updateMe')
.put(profileServices.setUserID,profileValidation.updateOne, profileServices.updateOne)
profileRouter.route('/change-password')
.put(profileServices.setUserID,profileValidation.changePassword, profileServices.changePassword)
profileRouter.route("/delete")
  .delete(profileServices.setUserID,profileValidation.deleteOne, profileServices.deleteOne);
export default profileRouter