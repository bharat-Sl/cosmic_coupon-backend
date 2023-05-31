import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Usedcoupon = new Schema({
    user_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "users"
    },
    coupon_id: {
        type: Schema.Types.Mixed,
        default: null,
        ref: "Coupon"
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
Usedcoupon.plugin(autoIncrement.plugin, {
    model: 'Usedcoupon',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Usedcoupon", Usedcoupon);
