import mongoose from "mongoose";
import Products from "./products.interface";
const productsSchema = new mongoose.Schema<Products>(
  {
    category: { type: mongoose.Types.ObjectId, ref: "categories" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "subcategories" },
    name: { required: true, trim: true, type: String },
    description: { type: String, trim: true },
    price: { type: Number },
    discount: { type: Number },
    priceAfterDiscount: { type: Number },
    cover: { type: String, default: "this is cover" },
    images: { type: [String] },
    rateAvg: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);
productsSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "product",
  ref: "reviews",
});

productsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: "subcategory", select: "name" });
  next();
});
const imageUrl = (document: Products) => {
  if (document.cover)
    document.cover = `${process.env.BASE_URL}/images/products/${document.cover}`;
  if (document.images)
    document.images = document.images.map(
      (image) => `${process.env.BASE_URL}/images/products/${image}`
    );
};
productsSchema.post("init", imageUrl).post("save", imageUrl);
export default mongoose.model<Products>("products", productsSchema);
