import { Request,RequestHandler,NextFunction,Response } from "express";
import { validationResult } from "express-validator";
const validatorMiddleware:RequestHandler =(req: Request, res: Response, next: NextFunction) =>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ errors: error.array() });
    }
    else {
        next();
    }
}
export default validatorMiddleware