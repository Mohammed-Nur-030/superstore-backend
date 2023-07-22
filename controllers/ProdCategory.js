const PCategory = require('../models/prodcategoryModel')
const validateMongoDbId = require('../utils/validateMongodbID')

// create category
exports.createCategory = async (req, res) => {
    try {
        const newCategory=await PCategory.create(req.body);
        res.json({
            success:true,
            message:"Category Successfully created"
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating the category"
        })

    }
}
//update Category
exports.updateCategory = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);

        
        const updatedCategory=await PCategory.findByIdAndUpdate(id,req.body ,
            {new:true}
            );
        res.json({
            success:true,
            message:"Category updated successfully",
            updatedCategory,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating the category"
        })

    }
}
//delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);
        
        const deletedCategory=await PCategory.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Category Deleted successfully",
            deletedCategory,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting the category"
        })

    }
}
// get a category 
exports.getACategory = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getACategory=await PCategory.findById(id);
        res.json({
            success:true,
            message:"Category Successfully fetched",
            getACategory
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the category"
        })

    }
}
//get all category
exports.getAllCategory = async (req, res) => {
    try{
     
        const getAllCategory=await PCategory.find();
        res.json({
            success:true,
            message:"Categories Successfully fetched",
            getAllCategory
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the categories"
        })

    }
}