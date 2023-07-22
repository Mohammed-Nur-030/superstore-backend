const express=require('express');
const router=express.Router();

const {createEnquiry, updateEnquiry,deleteEnquiry, getAEnquiry, getAllEnquiry}=require('../controllers/Enquiry');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post("/create-enquiry",authMiddleware ,createEnquiry);
router.put("/:id",authMiddleware, isAdmin ,updateEnquiry);
router.delete("/delete-enquiry/:id",authMiddleware, isAdmin ,deleteEnquiry);
router.get("/get-enquiry/:id",getAEnquiry);
router.get("/get-all-enquiries",getAllEnquiry);


module.exports=router;