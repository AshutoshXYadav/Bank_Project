const mongoose = require('mongoose');
 const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        trim: true
       

    }
}, { timestamps: true });

new userSchema.pre("save", async function (next){

    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);   
    }


const User = mongoose.model('User', userSchema);
module.exports = User;