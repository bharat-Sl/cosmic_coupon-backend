import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Offer = new Schema({
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
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default:"active"
    },
    discount: {
        type: Number,
        default:0
    },
    exclusive: {
        type: String,
        default: "no"
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
Offer.plugin(autoIncrement.plugin, {
    model: 'Offer',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Offer", Offer);
