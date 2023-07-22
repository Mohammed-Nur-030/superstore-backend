const express=require('express');
const router=express.Router();

const {createBrand, updateBrand,deleteBrand, getABrand, getAllBrand}=require('../controllers/Brand');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post("/create-brand",authMiddleware, isAdmin ,createBrand);
router.put("/:id",authMiddleware, isAdmin ,updateBrand);
router.delete("/delete-brand/:id",authMiddleware, isAdmin ,deleteBrand);
router.get("/get-brand/:id",getABrand);
router.get("/get-all-brands",getAllBrand);


module.exports=router;