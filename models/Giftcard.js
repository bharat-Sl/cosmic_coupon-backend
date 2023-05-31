import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Giftcard = new Schema({
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
Giftcard.plugin(autoIncrement.plugin, {
    model: 'Giftcard',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Giftcard", Giftcard);
