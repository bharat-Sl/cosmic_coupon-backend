import mongoose from "mongoose";
import { isNull } from "util";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);


let Wallethistory = new Schema({
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "users"
    },
    amount: {
        type: Number,
        default: 0
    },
    txn_fee:{
        type:Number,
        default:0
    },
    total_amount:{
        type:Number,
        default:0
    },
    message:{
        type:String,
        default:null
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
Wallethistory.plugin(autoIncrement.plugin, {
    model: 'Wallethistory',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Wallethistory", Wallethistory);
