const mongoose = require("mongoose");

const blackListSchema =  new mongoose.Schema({
    token:{
        type: String,
        required: true,
        immutable: true

    },
    createdAt:{
        type: Date,
        default: Date.now
    }

} ,{
    timestamps: true
}

)
blackListSchema.index({
    createdAt:1},{
        expiresInSeconds: 60*60*24*3
})

const blackListModel = mongoose.model('BlackList', blackListSchema);
module.exports = blackListModel;