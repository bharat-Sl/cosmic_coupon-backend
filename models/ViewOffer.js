import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Viewoffer = new Schema({
    
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Users"
    },
    offer_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Offer"
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
Viewoffer.plugin(autoIncrement.plugin, {
    model: 'Viewoffer',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Viewoffer", Viewoffer);
