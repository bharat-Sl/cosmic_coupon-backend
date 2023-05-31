import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Viewdeal = new Schema({
    
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Users"
    },
    deal_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Deal"
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
Viewdeal.plugin(autoIncrement.plugin, {
    model: 'Viewdeal',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Viewdeal", Viewdeal);
