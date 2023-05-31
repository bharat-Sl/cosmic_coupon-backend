import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Usergroup = new Schema({
    page_name: {
        type: Schema.Types.Mixed,
        default: null
    },
    group_name: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'Active',
    },
    description:{
        type:String,
        default:null
    },
    assign_module:{
        type:Schema.Types.Mixed,
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
Usergroup.plugin(autoIncrement.plugin, {
    model: 'Usergroup',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Usergroup", Usergroup);
