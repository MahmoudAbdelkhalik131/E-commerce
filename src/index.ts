import express from "express"
import categoriesRouter from "./categories/categories.routes"
import subCategoriesRouter from "./subcategories/subcategories.routes"
import ApiErrors from "./utils/apiErrors"
import AddressRouter from "./address/address.routes"
import wishListRouter from "./wishlist/wishlist.routes"
import globalErrors from "./middleware/errors.middleware"
import productsRouter from "./products/products.routes"
import userRouter from "./users/users.routes"
import authRouter from "./authentication/auth.routes"
import Users from "./users/users.interface"
import profileRouter from "./profile/profile.routes"
import googleRoute from "./google/google.Route"
declare module "express"{
    interface Request{
        filterSubcategoryUsingCategory?:any,
        files?:any,
        user?: Users;
    }
    
}
const routes=(app:express.Application)=>{
app.use('/auth/google',googleRoute)
app.use('/api/v1/wishlist',wishListRouter)
app.use('/api/v1/address',AddressRouter)
app.use('/api/v1/categories',categoriesRouter)
app.use('/api/v1/profile',profileRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/subcategories',subCategoriesRouter)
app.use('/api/v1/products',productsRouter)
app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    next(new ApiErrors(`route ${req.baseUrl} not found`, 400));
});
app.use(globalErrors)
}
export default routes