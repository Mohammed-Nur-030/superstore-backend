
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require("../utils/Cloudinary");
const fs=require('fs');


exports.uploadImages=async(req,res)=>{
    try{
      
         const uploader =(path)=>cloudinaryUploadImage(path,'images');
         const urls=[];
         const files=req.files;
         console.log("files",files)


         for(const file of files){
            const {path}=file;
            const newpath=await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
         }

         const images=urls.map((file)=>{
            return file;
        });
         

        res.status(200).json({
            success:true,
            message:"Files uploaded successfully",
            images,
        })

    }catch(err){
        console.error(err);
        return res.json({
            success:false,
            message:"Error while uploading image",
        });

    }
}

exports.deleteImages=async(req,res)=>{
    try{
        const{id}=req.params;
         const deleted =cloudinaryDeleteImage(id,'images');


        res.status(200).json({
            success:true,
            message:"Files deleted successfully",
       
        })

    }catch(err){
        console.error(err);
        return res.json({
            success:false,
            message:"Error while deleting image",
        });

    }
}

