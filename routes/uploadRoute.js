const express=require('express');
const router=express.Router();

const {isAdmin,authMiddleware}=require("../middlewares/authMiddleware");
const { uploadImages, deleteImages}=require("../controllers/Upload");
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

router.post("/upload-images",authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages);
router.delete("/delete-image/:id",authMiddleware,isAdmin,deleteImages);



module.exports=router;