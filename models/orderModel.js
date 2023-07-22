const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  shippingInfo:{
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    other:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true,
    },
  },
  paymentInfo:{
    razorOrderId:{
        type:String,
        required:true,
    },
    razorPaymentId:{
        type:String,
        required:true,
    }
  },
  orderItems:[
    {
    
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        color:{
            type:String,
            requied:true,
        },
        quantity:{
            type:Number,
            requied:true,
        },
        price:{
            type:Number,
            requied:true,
        },
    

  }
],
paidAt:{
    type:Date,
    default:Date.now()
},
totalPrice:{
    type:Number,
    required:true,
},
totalPriceAfterDiscount:{
    type:Number,
    required:true,
},
orderStatus:{
    type:String,
    default:"Ordered"
}
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);