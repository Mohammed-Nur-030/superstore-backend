const mongoose=require('mongoose')
const validateMongoDbId=(id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(id);

    if(!isValid){
       console.error("This is not valide or not found");
    }
}
module.exports=validateMongoDbId;