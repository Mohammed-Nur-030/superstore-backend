const express=require('express')
const app=express();
const cookieParser=require("cookie-parser");
require('dotenv').config();
const PORT=process.env.PORT || 4000;

//connect to Db
require('./config/database').connect();

//add cookie parsor and express.json
app.use(express.json());
app.use(cookieParser());

//using morgan
const morgan=require("morgan");
app.use(morgan("dev"));

// cors
const cors=require("cors")
app.use(cors());

//routes
const authRoute=require('./routes/authRoute');
const productRoute=require('./routes/productRoute')
const blogRoute=require('./routes/blogRoute')
const prodcategoryRoute=require('./routes/prodcategoryRoute')
const blogCategoryRoute=require('./routes/blogCategoryRoute')
const brandRoute= require('./routes/brandRoute')
const couponRoute=require('./routes/couponRoute')
const colorRoute=require('./routes/colorRoute')
const enquiryRoute=require('./routes/enquiryRoute')
const uploadRoute=require('./routes/uploadRoute')
app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/blog",blogRoute);
app.use("/api/category",prodcategoryRoute);
app.use("/api/blogcategory",blogCategoryRoute);
app.use("/api/brand",brandRoute);
app.use("/api/coupon",couponRoute);
app.use("/api/color",colorRoute);
app.use("/api/enquiry",enquiryRoute);
app.use("/api/upload",uploadRoute);

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})
app.get("/",(req,res)=>{
    res.send(`<h1>Welcome to my homepage</h1>`)
})