import { DESTRUCTION } from "dns";
import mongoose from "mongoose";

class Features {
  //  search   sort   field page
public paginationResult:any
  constructor(
    public mongooseQuery: mongoose.Query<any[], any>,
    private queryString: any
  ) {}
  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort);
    } else {
      this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  search(modelName: string) {
    let query: any;
    if (this.queryString.search) {
      if (modelName) {
         query={$or:[
            {name:new RegExp(this.queryString.search,'ig')},
            {description:new RegExp(this.queryString.search, "ig")}
         ]}
      } else {
        query = { name: new RegExp(this.queryString.search, "ig") };
      }
      this.mongooseQuery.find(query);
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      this.mongooseQuery.select(`-${this.queryString.fields}`);
    } else {
      this.mongooseQuery.select("-__v");
    }
    
    return this;
  }
  pagination(documentsCount:number) {
   const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        const pagination: any = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.totalPages = Math.ceil(documentsCount / limit);
        if (endIndex < documentsCount) pagination.next = page + 1;
        if (skip > 0) pagination.prev = page - 1;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
  
  }
  filter() {
    const queryStringObj: any = {...this.queryString};
        const executedFields: string[] = ['page', 'limit', 'sort', 'fields', 'search', 'lang'];
        executedFields.forEach((field: string): void => {
            delete queryStringObj[field]
        });
        let queryStr: string = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
  }
}
export default Features;
