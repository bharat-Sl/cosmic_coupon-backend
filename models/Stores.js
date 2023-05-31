import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Stores = new Schema({
    name: {
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
    edit_by:{
        type:String,
        default:null
    },
    type: {
        type: String,
        default:null
    },
    status: {
        type: String,
        default:"active"
    },
    category_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Categories"
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
Stores.plugin(autoIncrement.plugin, {
    model: 'Stores',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Stores", Stores);
