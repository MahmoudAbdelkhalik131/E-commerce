import dotenv from "dotenv";
dotenv.config();
import express, { Router } from "express";
import dbConnection from "./config/dataBase";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes, { Routes } from "./src";
import i18n from "i18n";
import { METHODS, Server } from "http";
import path from "path";
import hpp from "hpp";
import compression from "compression";
import helmet from "helmet";

import MongoSanitize from "express-mongo-sanitize";
const app: express.Application = express();
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];
// app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);// Allow requests with no origin (mobile apps, curl, Postman)
      if(ALLOWED_ORIGINS.indexOf(origin)===-1){
        console.warn(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null,true)
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token",
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
      "Cache-Control"
    ],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours cache for preflight requests
  })
);
app.options("*", cors());
app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());
app.use(MongoSanitize());
app.use(helmet({crossOriginResourcePolicy: {policy: 'cross-origin'}}));
app.use(compression());

let server: Server;
dotenv.config();
dbConnection();

// Images are now served via Cloudinary CDN — local static serving no longer needed
// app.use("/images", express.static(path.join(__dirname, "../uploads/images")));
app.use(hpp({ whitelist: ["price"] }));
i18n.configure({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locals"),
  defaultLocale: "en",
  queryParameter: "language",
});
app.use(i18n.init);
Routes(app);
routes(app);
server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`unhandledRejection ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting the application down");
    process.exit(1);
  });
});
