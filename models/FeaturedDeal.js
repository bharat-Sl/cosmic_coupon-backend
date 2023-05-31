import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Featureddeal = new Schema({
    deal_id: {
        type: String,
        default: null,
        ref: "Deal"
    },
    image: {
        type: String,
        default: null
    },
    start_date: {
        type: Date,
        default: null
    },
    expire_date: {
        type: Date,
        default: null
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
Featureddeal.plugin(autoIncrement.plugin, {
    model: 'Featureddeal',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Featureddeal", Featureddeal);
