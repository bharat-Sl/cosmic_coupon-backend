import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Recharge = new Schema({
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Users"
    },
    amount: {
        type:Number,
        default:0
    },
    mobile_number: {
        type: String,
        default: null,
    },
    transaction_id: {
        type: String,
        default: null,
    },
    operator: {
        type: String,
        default: null,
    },
    circle: {
        type: String,
        default: null,
    },
    recharge_type: {
        type: String,
        default: null,
    },
    order_id:{
        type:String,
        default:null
    },
    payment_id:{
        type:String,
        default:null
    },
    payment_mode:{
        type:String,
        default:"wallet"
    },
    status: {
        type: String,
        default:null
    },
    message: {
        type: String,
        default:null
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
Recharge.plugin(autoIncrement.plugin, {
    model: 'Recharge',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Recharge", Recharge);
