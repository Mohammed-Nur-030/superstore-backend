const mongoose = require('mongoose'); // Erase if already required


var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,  
        trim:true,    
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        ref:"true",
    },
    quantity:{
        type:Number,
    },
    sold:{
        type:Number,
        default: 0 ,
        select:false,//hiding the sold from user
    },
    images:[{
        public_id:String,
        url:String,
    }],
   color:{
    // type:mongoose.Schema.Types.ObjectId,
    // ref:"Color",
    type:Array,
   },
   tags:{
    type:Array,
   },

   
    ratings:[{
        star:Number,
        comment:{
            type:String,
        },
        postedby:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
                
            },
         name: String, // Add the name field
    }],
    totalRating:{
        type:String,
        default:0,
    },
},
{
    timestamps:true,
}
);

//Export the model
module.exports = mongoose.model('Product', productSchema);