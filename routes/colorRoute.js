const express=require('express');
const router=express.Router();

const {createColor, updateColor,deleteColor, getAColor, getAllColor}=require('../controllers/Color');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post("/create-color",authMiddleware, isAdmin ,createColor);
router.put("/:id",authMiddleware, isAdmin ,updateColor);
router.delete("/delete-color/:id",authMiddleware, isAdmin ,deleteColor);
router.get("/get-color/:id",getAColor);
router.get("/get-all-colors",getAllColor);


module.exports=router;