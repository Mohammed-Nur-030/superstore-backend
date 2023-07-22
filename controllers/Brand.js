const Brand = require('../models/brandModel')
const validateMongoDbId = require('../utils/validateMongodbID')

// create Brand
exports.createBrand = async (req, res) => {
    try {
        const newBrand=await Brand.create(req.body);
        res.json({
            success:true,
            message:"Brand Successfully created"
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating the Brand"
        })

    }
}
//update Brand
exports.updateBrand = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);

        
        const updatedBrand=await Brand.findByIdAndUpdate(id,req.body ,
            {new:true}
            );
        res.json({
            success:true,
            message:"Brand updated successfully",
            updatedBrand,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating the Brand"
        })

    }
}
//delete a Brand
exports.deleteBrand = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);
        
        const deletedBrand=await Brand.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Brand Deleted successfully",
            deletedBrand,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting the Brand"
        })

    }
}
// get a Brand 
exports.getABrand = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getABrand=await Brand.findById(id);
        res.json({
            success:true,
            message:"Brand Successfully fetched",
            getABrand
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Brand"
        })

    }
}
//get all Brand
exports.getAllBrand = async (req, res) => {
    try{
     
        const getAllBrand=await Brand.find();
        res.json({
            success:true,
            message:"Brands Successfully fetched",
            getAllBrand
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Brands"
        })

    }
}