const express=require('express');
const router=express.Router();

const {isAdmin,authMiddleware}=require("../middlewares/authMiddleware");
const {createProduct,getaProduct,getAllProducts,updateProduct,deleteProduct, addToWishList, rating}=require("../controllers/Product");
;

router.post("/",authMiddleware,isAdmin,createProduct);

router.put("/wishlist",authMiddleware,addToWishList);
router.put("/rating",authMiddleware,rating);
router.get("/all-products",getAllProducts);
router.delete("/delete/:id",authMiddleware,isAdmin,deleteProduct);
router.get("/:id",getaProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);



module.exports=router;