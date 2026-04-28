import Users from "./src/users/users.interface";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT: number;
            readonly DB: string;
            readonly NODE_ENV: 'development' | 'production';
            readonly BASE_URL: string;
            readonly JWT_KEY: string;
            readonly JWT_EXPIRE: string;
            readonly JWT_RESET_EXPIRE: string;
            readonly JWT_RESET_KEY: string;
            readonly EMAIL_HOST: string;
            readonly EMAIL_USERNAME: string;
            readonly EMAIL_PASSWORD: string;
            readonly APP_NAME: string;
            readonly Mongo: string;
            readonly CLOUDINARY_CLOUD_NAME: string;
            readonly CLOUDINARY_API_KEY: string
            readonly CLOUDINARY_API_SECRET: string
        }
    }

    namespace Express {
        interface User extends Users {}
        interface Request {
            filterById?: any;
            files?: any;
        }
    }
}
