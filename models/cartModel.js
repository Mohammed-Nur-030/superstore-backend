const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        amount:{
            type:String,
            required:true,
        },
        // count:{
        //     type:Number,
        // },
        color:{
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"Color",
            type:String,
        },
        price:{
            type:Number,
            required:true,
        },
      
        // cartTotal:{
        //     type:Number,
        // },
        // totalAfterDiscount:{
        //     type:Number,
        // },
        // paymentIntent:{
    
        // },
        // orderStatus:{
        //     type:String,
        //     default:'Not Processed',
        //     enum:["Not Processed","Out for Deleivery","Processing","Dispatched","Cancelled","Delivered"],
        // },
        // orderBy:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"User",
        // },
    
    },{
        timestamps:true,
    }
);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);