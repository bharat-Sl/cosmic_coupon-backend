import mongoose from "mongoose";
import { isNull } from "util";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);


let Users = new Schema({
    name: {
        type: String,
        default: null
    },
    mobile: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    device_token: {
        type: String,
        default: null
    },
    registered_via: {
        type: String,
        default: "web"
    },
    login_via:{
        type:String,
        default:"mobile"
    },
    point:{
        type:Number,
        default:0
    },
    social_id:{
        type:String,
        default:null
    },
    profile_picture: {
        type: String,
        default: null
    },
    referal_code:{
        type:String,
        default:null
    },
    imps_access:{
        type:Number,
        default:0
    },
    upline_code:{
        type:String,
        default:null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    }
    
});
autoIncrement.initialize(mongoose.connection);
Users.plugin(autoIncrement.plugin, {
    model: 'Users',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Users", Users);
