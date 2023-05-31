import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Notification = new Schema({
    title: {
        type: String,
        default: null
    },
    message: {
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
Notification.plugin(autoIncrement.plugin, {
    model: 'Notification',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Notification", Notification);
