const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['author', 'admin'],
        default: 'author',
        required: true
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 12);
    }
   
});

module.exports = mongoose.model('User', userSchema);
