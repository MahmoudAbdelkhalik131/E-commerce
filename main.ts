import express from "express";
import dbConnection from "./config/dataBase";
import dotenv from 'dotenv'
import routes from "./src";
import i18n from "i18n";
import { Server } from "http";
import path from "path";
import hpp from 'hpp'
import MongoSanitize from "express-mongo-sanitize";

const app: express.Application = express();
app.use(express.json({ limit: "10kb" }));
app.use(MongoSanitize())
let server:Server
dotenv.config()
app.use(express.static('uploads'))
app.use(hpp({whitelist:['price']}))
i18n.configure({
locales:['en','ar'],
directory:path.join(__dirname,'locals'),
defaultLocale:'en',
queryParameter:'language'
}) 
app.use(i18n.init)
dbConnection()
routes(app)
server= app.listen(process.env.PORT,()=>{
  console.log(`server started on port ${process.env.PORT}`)
}) 

process.on('unhandledRejection', (err: Error) => {
  console.error(`unhandledRejection ${err.name} | ${err.message}`);
  server.close(() => {
      console.error('shutting the application down');
      process.exit(1);
  });
});