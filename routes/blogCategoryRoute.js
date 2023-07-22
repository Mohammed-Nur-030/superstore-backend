const express=require('express')
const router=express.Router();

const {createBlog, updateBlog,deleteBlog, getABlog, getAllBlog}=require('../controllers/BlogCategory');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post("/create-blogcategory",authMiddleware, isAdmin ,createBlog);
router.put("/:id",authMiddleware, isAdmin ,updateBlog);
router.delete("/delete-blogcategory/:id",authMiddleware, isAdmin ,deleteBlog);
router.get("/get-blogcategory/:id",getABlog);
router.get("/get-all-blogcategories",getAllBlog);

module.exports=router;  