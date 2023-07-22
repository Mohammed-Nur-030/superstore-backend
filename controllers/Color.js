const Color = require('../models/colorModel')
const validateMongoDbId = require('../utils/validateMongodbID')

// create Color
exports.createColor = async (req, res) => {
    try {
        const newColor=await Color.create(req.body);
        res.json({
            success:true,
            message:"Color Successfully created",
            newColor
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating the Color"
        })

    }
}
//update Color
exports.updateColor = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);

        
        const updatedColor=await Color.findByIdAndUpdate(id,req.body ,
            {new:true}
            );
        res.json({
            success:true,
            message:"Color updated successfully",
            updatedColor,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating the Color"
        })

    }
}
//delete a Color
exports.deleteColor = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);
        
        const deletedColor=await Color.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Color Deleted successfully",
            deletedColor,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting the Color"
        })

    }
}
// get a Color 
exports.getAColor = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getAColor=await Color.findById(id);
        res.json({
            success:true,
            message:"Color Successfully fetched",
            getAColor
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Color"
        })

    }
}
//get all Color
exports.getAllColor = async (req, res) => {
    try{
     
        const getAllColor=await Color.find();
        res.json({
            success:true,
            message:"Colors Successfully fetched",
            getAllColor
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Colors"
        })

    }
}