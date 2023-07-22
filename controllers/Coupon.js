const { validate } = require("../models/brandModel");
const Coupon =require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbID");
 
exports.createCoupon=async(req,res)=>{
    try{
        const newCoupon= await Coupon.create(req.body);
        res.status(200).json({
            success:true,
            message:"Coupon created successfully",
            newCoupon,
        })


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating Coupon",
        })

    }

}
// get a Color 
exports.getCoupon = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getCoupon=await Coupon.findById(id);
        res.json({
            success:true,
            message:"Coupon Successfully fetched",
            getCoupon
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Coupon"
        })

    }
}
exports.getAllCoupon=async(req,res)=>{
    try{
        const AllCoupons= await Coupon.find();
        res.status(200).json({
            success:true,
            message:" All Coupon fetched successfully",
            AllCoupons,
        })


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching all Coupons ",
        })

    }

}
exports.updateCoupon=async(req,res)=>{
    try{
        const {id}=req.params;
        validateMongoDbId(id);

        const updatedCoupon= await Coupon.findByIdAndUpdate(id,  req.body, {
            new:true,
        });
        res.status(200).json({
            success:true,
            message:"  Coupon updated successfully",
            updatedCoupon,
        })


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating Coupons ",
        })

    }

}
exports.deleteCoupon=async(req,res)=>{
    try{
        const {id}=req.params;
        validateMongoDbId(id);

        const deletedCoupon= await Coupon.findByIdAndDelete(id,  req.body, {
            new:true,
        });
        res.status(200).json({
            success:true,
            message:"  Coupon deleted successfully",
            deletedCoupon,
        })


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting Coupons ",
        })

    }

}