import mongoose from'mongoose'
const dbConnection=()=>{mongoose.connect(process.env.Mongo!)
    .then(()=>{console.log("DATA_BASE_CHECKED")})

}
export default dbConnection