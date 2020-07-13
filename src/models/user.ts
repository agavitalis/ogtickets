import * as mongoose from "mongoose";

interface IUser{

    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userRole: String,
    isVerified: Boolean,
    isBanned: Boolean
}

interface IUserRegister{

    firstName: String,
    lastName: String,
    email: String,
    password: String
}

interface IUserLogin{

    email: String,
    password: String

}

 
const UserSchema = new mongoose.Schema({

    firstName: { type: String, },
    lastName: { type: String,},
    email: { type: String, },
    password: { type: String, select: false },
    
    userRole: {
        type: String,
        enum : ['customer','support','admin'],
        default: 'customer'
    },

    isVerified: { type: Boolean},
    isBanned: { type: Boolean,default:false},

},{
    timestamps: true
});
 
const UserModel = mongoose.model('User', UserSchema);
 
export { UserModel,IUser, IUserRegister,IUserLogin}