const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// the passport package will add on unique username and passwords fields into the schema
userSchema.plugin(passportLocalMongoose);

// create and export the model User
module.exports = mongoose.model('User', userSchema);

