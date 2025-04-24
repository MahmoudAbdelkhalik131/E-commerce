import { Router } from "express";
import authenticationServices from "./auth.service";
import authValidation from "./auth.validation";
const authRouter:Router=Router()
authRouter.route('/login')
.post(authValidation.logIn,authenticationServices.login)
authRouter.route('/login/admin')
.post(authValidation.logIn,authenticationServices.login)
authRouter.route('/signup')
.post(authValidation.sighUp,authenticationServices.sginUp)
authRouter.route('/forget-password')
.post(authValidation.forgetPassword,authenticationServices.forgetPassword)
authRouter.route('/verify-code')
.post(authenticationServices.verifyCode)
export default authRouter