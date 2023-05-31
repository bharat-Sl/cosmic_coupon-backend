import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Deal = new Schema({
    title: {
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
    exclusive: {
        type: String,
        default: "no"
    },
    hot_deal: {
        type: String,
        default: "no"
    },
    start_date: {
        type: Date,
        default: null
    },
    end_date: {
        type: Date,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    discount_type: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    link:{
        type:String,
        default:null
    },
    image: {
        type: String,
        default: null
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
Deal.plugin(autoIncrement.plugin, {
    model: 'Deal',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Deal", Deal);
