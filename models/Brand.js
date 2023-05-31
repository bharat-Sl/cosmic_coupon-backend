import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Brand = new Schema({
    brand_name: {
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
    status: {
        type: String,
        default:"active"
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
Brand.plugin(autoIncrement.plugin, {
    model: 'Brand',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Brand", Brand);
