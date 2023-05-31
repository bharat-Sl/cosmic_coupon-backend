import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Coupon = new Schema({
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
    exclusive: {
        type: String,
        default: "no"
    },
    store_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Stores"
    },
    link:{
        type:String,
        default:null
    },
    brand_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Brand"
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default:"active"
    },
    code: {
        type: String,
        default:null
    },
    discount: {
        type: Number,
        default: 0
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
Coupon.plugin(autoIncrement.plugin, {
    model: 'Coupon',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Coupon", Coupon);
