import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Featuredtodaytask = new Schema({
    task_id: {
        type: String,
        default: null,
        ref: "Task"
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
Featuredtodaytask.plugin(autoIncrement.plugin, {
    model: 'Featuredtodaytask',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Featuredtodaytask", Featuredtodaytask);
