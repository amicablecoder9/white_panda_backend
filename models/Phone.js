const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define user model schema
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    countryCode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    authyId: String,
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

// Export user model
module.exports = Phone = mongoose.model("phones", UserSchema);
