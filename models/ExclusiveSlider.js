import mongoose from "mongoose";
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
mongoose.set('useCreateIndex', true);

let Exclusiveslider = new Schema({
    text: {
        type: String,
        default: null
    },
    
    image: {
        type: String,
        default: null
    },
    edit_by:{
        type:String,
        default:null
    },
    status: {
        type: String,
        default:"active"
    },
    type:{
        type:String,
        default:null
    },
    type_id: {
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
Exclusiveslider.plugin(autoIncrement.plugin, {
    model: 'Exclusiveslider',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model("Exclusiveslider", Exclusiveslider);
