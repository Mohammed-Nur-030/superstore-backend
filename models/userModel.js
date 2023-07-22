// !mdbgum --->write this and press enter then u give a snippet for userSchema

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        // unique:true,
        index:true,
    },
    lastName:{
        type:String,
        required:true,
        // unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        // unique:true,
    },
    password:{
        type:String,
        // required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:{
         type: String,
        },
    wishList:[{ 
        type: mongoose.Schema.Types.ObjectId,
         ref:"Product" 
        }],
       refreshToken:{
        type:String,
        default:'',
       },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    },
        
},
{
timestamps:true,
});

// userSchema.pre("save",async function (next){
//     if(!this.isModified('passowrd')){
//         next();
//     }
//     const salt=await bcrypt.genSaltSync(10);
//     this.password=await brcypt.hash(this.password,salt);
//     next();
// })

// userSchema.methods.isPasswordMatched=async function (enteredPassword){
//     return await bcrypt.compare(enteredPassword)
// }


module.exports = mongoose.model('User', userSchema);


