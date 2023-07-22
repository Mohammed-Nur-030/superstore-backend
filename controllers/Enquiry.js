const Enquiry = require('../models/enqModel')
const validateMongoDbId = require('../utils/validateMongodbID')

// create Enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const newEnquiry=await Enquiry.create(req.body);
        res.json({
            success:true,
            message:"Enquiry Successfully created",
            newEnquiry
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating the Enquiry"
        })

    }
}
//update Enquiry
exports.updateEnquiry = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);

        
        const updatedEnquiry=await Enquiry.findByIdAndUpdate(id,req.body ,
            {new:true}
            );
        res.json({
            success:true,
            message:"Enquiry updated successfully",
            updatedEnquiry,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating the Enquiry"
        })

    }
}
//delete a Enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);
        
        const deletedEnquiry=await Enquiry.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Enquiry Deleted successfully",
            deletedEnquiry,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting the Enquiry"
        })

    }
}
// get a Enquiry 
exports.getAEnquiry = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getAEnquiry=await Enquiry.findById(id);
        res.json({
            success:true,
            message:"Enquiry Successfully fetched",
            getAEnquiry
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Enquiry"
        })

    }
}
//get all Enquiry
exports.getAllEnquiry = async (req, res) => {
    try{
     
        const getAllEnquiry=await Enquiry.find();
        res.json({
            success:true,
            message:"Enquirys Successfully fetched",
            getAllEnquiry
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Enquirys"
        })

    }
}