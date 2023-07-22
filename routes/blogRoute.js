const express=require('express')
const router=express.Router();

const {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog,likeBlog,dislikeBlog,uploadImages}=require('../controllers/Blog')
const {authMiddleware,isAdmin}=require('../middlewares/authMiddleware')
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');


router.post("/create-blog",authMiddleware,isAdmin,createBlog);
router.put("/likes",authMiddleware,likeBlog);
router.put("/upload-images/:id",authMiddleware,isAdmin,uploadPhoto.array('images',2),blogImgResize,uploadImages);
router.put("/dislikes",authMiddleware,dislikeBlog);
router.put("/:id",authMiddleware,updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBlogs);
router.delete("/:id",deleteBlog);

module.exports=router; 