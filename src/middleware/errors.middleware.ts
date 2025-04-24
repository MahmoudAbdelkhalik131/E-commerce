import express, { NextFunction } from "express";
import ApiErrors from "../utils/apiErrors";
const devErrors = (err: any, res: express.Response) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const handleTokenErrors=(message:string,req:express.Request)=>{
  return new ApiErrors(message,401)
}
const prodErrors = (err: any, res: express.Response) => {
  res.status(err.statusCode!).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrors = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if(err.name==='TokenExpiredError'||err.name==='JsonWebTokenError'){
    err=handleTokenErrors(`${req.__('session_expired')}`,req)
  }

  if (process.env.NODE_ENV === "development") devErrors(err, res);
  else prodErrors(err, res);
};
export default globalErrors;
