import { Router } from "express";
import AddressServices from "./address.service";
import addressValidation from "./address.valid";
import authenticationServices from "../authentication/auth.service";
const AddressRouter=Router()
AddressRouter.use(authenticationServices.protectedRoutes, authenticationServices.checkActive);
AddressRouter.route('/')
.get(AddressServices.getAddress)
.post(AddressServices.addAddress)
AddressRouter.route('/:addressId')
.delete(addressValidation.removeAddress,AddressServices.removeAddress)
export default AddressRouter