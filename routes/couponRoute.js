const express=require('express')
const router=express.Router();

const {createCoupon, getAllCoupon, updateCoupon,deleteCoupon,getCoupon}=require("../controllers/Coupon");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post("/create-coupon",authMiddleware,isAdmin, createCoupon);
router.get("/get-all-coupons",authMiddleware,isAdmin, getAllCoupon);
router.put("/:id",authMiddleware,isAdmin, updateCoupon);
router.get("/:id",authMiddleware,isAdmin, getCoupon);
router.delete("/delete-coupon/:id",authMiddleware,isAdmin, deleteCoupon);


module.exports=router;