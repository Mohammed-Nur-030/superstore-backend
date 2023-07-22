const express=require('express');
const router=express.Router();

const {createCategory, updateCategory,deleteCategory, getACategory, getAllCategory}=require('../controllers/ProdCategory');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post("/create-category",authMiddleware, isAdmin ,createCategory);
router.put("/:id",authMiddleware, isAdmin ,updateCategory);
router.delete("/delete-category/:id",authMiddleware, isAdmin ,deleteCategory);
router.get("/get-category/:id",getACategory);
router.get("/get-all-category",getAllCategory);


module.exports=router;