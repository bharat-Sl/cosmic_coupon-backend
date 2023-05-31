import mongoose from "mongoose";
import { isNull } from "util";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);


let Walletamount = new Schema({
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "users"
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
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
Walletamount.plugin(autoIncrement.plugin, {
    model: 'Walletamount',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Walletamount", Walletamount);
