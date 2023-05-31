import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Admins = new Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: 0
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        ref:"Usergroup",
        default: null,
    },
    position:{
        type:String,
        default:null
    },
    status:{
        type:String,
        default:"Active"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
autoIncrement.initialize(mongoose.connection);
Admins.plugin(autoIncrement.plugin, {
    model: 'Admins',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Admins", Admins);
