import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Categories = new Schema({
    cat_name: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    banner_image: {
        type: String,
        default: null
    },
    exclusive: {
        type: String,
        default: "no"
    },
    status: {
        type: String,
        default:"active"
    },
    type: {
        type: String,
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
Categories.plugin(autoIncrement.plugin, {
    model: 'Categories',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Categories", Categories);
