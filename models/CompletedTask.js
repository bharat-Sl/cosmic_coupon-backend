import mongoose from "mongoose";
import { isNull } from "util";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Completedtask = new Schema({
    user_id: {
        type: Number,
        default: null,
        ref:"Users"
    },
    offer_id: {
        type: Number,
        default: null,
        ref:'Task'
    },
    status:{
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
    }
});
autoIncrement.initialize(mongoose.connection);
Completedtask.plugin(autoIncrement.plugin, {
    model: 'Completedtask',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Completedtask", Completedtask);
