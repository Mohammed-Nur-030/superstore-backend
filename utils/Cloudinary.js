// const cloudinary=require("cloudinary").v2


// cloudinary.config({
//             cloud_name:process.env.CLOUD_NAME,
//             api_key:process.env.API_KEY,
//             api_secret:process.env.API_SECRET,
            
// });
   
// exports.cloudinaryUploadImage=async(fileToUploads)=>{
//     return new Promise((resolve)=>{
//         cloudinary.uploader.upload(fileToUploads,(result)=>{
//             resolve(
//                 {
//                     url: result.secure_url,
//                 },
//                 {
//                     resource_type:"auto",
//                 }
//             );
//         });
//     });
// }
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = promisify(cloudinary.uploader.upload);
const deleteResource = promisify(cloudinary.uploader.destroy);

exports.cloudinaryUploadImage = async (fileToUploads) => {
  try {
    const result = await uploadImage(fileToUploads);
    return {
      url: result.secure_url,
      asset_id:result.asset_id,
      public_id:result.public_id,
      resource_type: "auto",
    };
  } catch (err) {
    console.log(err);
  }
};


exports.cloudinaryDeleteImage = async (fileToDelete) => {
  try {
    const result = await deleteResource(fileToDelete);
    return {
      url: result.secure_url,
      asset_id:result.asset_id,
      public_id:result.public_id,
      resource_type: "auto",
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error while deleting image');
  }
};
