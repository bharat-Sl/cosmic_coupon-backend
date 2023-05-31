import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Subscribe = new Schema({
    email: {
        type: String,
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
Subscribe.plugin(autoIncrement.plugin, {
    model: 'Subscribe',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Subscribe", Subscribe);
