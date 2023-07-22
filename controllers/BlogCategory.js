const BCategory = require('../models/blogCategoryModel')
const validateMongoDbId = require('../utils/validateMongodbID')


// create Blog
exports.createBlog = async (req, res) => {
    console.log("inside blog categorty controller")
    try {
        const newBlog= await BCategory.create(req.body);
        res.json({
            success:true,
            message:"Blog Successfully created",
            newBlog,
        }) 

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while creating the Blog"
        })

    }
}
//update Blog
exports.updateBlog = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);

        
        const updatedBlog=await BCategory.findByIdAndUpdate(id,req.body ,
            {new:true}
            );
        res.json({
            success:true,
            message:"Blog updated successfully",
            updatedBlog,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while updating the Blog"
        })

    }
}
//delete a Blog
exports.deleteBlog = async (req, res) => {
    try {
        const {id} =req.params;
        validateMongoDbId(id);
        
        const deletedBlog=await BCategory.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Blog Deleted successfully",
            deletedBlog,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while deleting the Blog"
        })

    }
}
// get a Blog 
exports.getABlog = async (req, res) => {
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getABlog=await BCategory.findById(id);
        res.json({
            success:true,
            message:"Blog Successfully fetched",
            getABlog
        })

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error while fetching the Blog"
        })

    }
}
//get all Blog
exports.getAllBlog = async (req, res) => {
    try{
     
        const getAllBlog=await BCategory.find();
        res.json({
            success:true,
            message:"Categories Successfully fetched",
            getAllBlog
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