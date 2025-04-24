import multer from "multer";
import ApiErrors from "../utils/apiErrors";
import {Request} from "express";
// const storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//       cb(null,'uploads/images/products')
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1]
//     const fileName:string=`product-${Date.now()}-cover-.${ext}`
//     cb(null,fileName)
//   }
// })
interface Fields {
    name: string;
    maxCount: number;
}

const uploadOptions = (fileTypes: string[]): multer.Multer => {
    const multerStorage= multer.memoryStorage();
    const multerFilter = function (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
        const isValidType: boolean = fileTypes.some((type) => file.mimetype.startsWith(type));
        if (isValidType) {
            cb(null, true);
        } else {
            cb(new ApiErrors('the file type is not allowed', 400))
        }

    };
    return multer({storage: multerStorage, fileFilter:multerFilter});
};

export const uploadSingleFile = (fileTypes: string[], fieldName: string) => uploadOptions(fileTypes).single(fieldName);
export const uploadMultiFiles = (fileTypes: string[], fields: Fields[]) => uploadOptions(fileTypes).fields(fields);