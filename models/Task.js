import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Task = new Schema({
    name: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    category_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Categories"
    },
    store_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Stores"
    },
    brand_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Brand"
    },
    button_name:{
        type:String,
        default:"Download"
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default:"active"
    },
    point: {
        type: Number,
        default:0
    },
    link: {
        type: String,
        default: null
    },
    start_date: {
        type: Date,
        default: null
    },
    expire_date: {
        type: Date,
        default:null
    },
    edit_by: {
        type: String,
        default:"admin"
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
Task.plugin(autoIncrement.plugin, {
    model: 'Task',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Task", Task);
