import mongoose from "mongoose";
import Reviews from "./review.interface";
const ReviewsSchema=new mongoose.Schema<Reviews>({
    comment:String,
    rate:Number,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'products'}
})
ReviewsSchema.statics.calcAverageRatings = async function (productId: string) {
    const stats = await this.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
            _id: "$product",
            nRating: { $sum: 1 },
            avgRating: { $avg: "$rate" },
        },
        },
    ]);
    if (stats.length > 0) {
      await mongoose.model("products").findByIdAndUpdate
        (productId, {
            rateAvg: stats[0].avgRating,
            rating: stats[0].nRating,
        });
    } else {
      await mongoose.model("products").findByIdAndUpdate(productId, {
        rateAvg: 0,
        rating: 0,
      });
    }
    };
    ReviewsSchema.post<Reviews>('save', async function () {
        await (this.constructor as any).calcAverageRatings(this.product)
    });
    ReviewsSchema.post<Reviews>('findOneAndUpdate', async function (doc: Reviews) {
        await (doc.constructor as any).calcAverageRatings(doc.product);
    });
    ReviewsSchema.post<Reviews>('findOneAndDelete', async function (doc: Reviews) {
        await (doc.constructor as any).calcAverageRatings(doc.product);
    });
ReviewsSchema.pre<Reviews>(/^find/,function(next){
    this.populate({path:'user',select:'name email'})
    next()
})
ReviewsSchema.pre<Reviews>(/^find/,function(next){
    this.populate({path:'product'})
    next()
})
export default mongoose.model('reviews',ReviewsSchema)