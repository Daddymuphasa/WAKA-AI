const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await require('bcryptjs').genSalt(10);
        this.password = await require('bcryptjs').hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await require('bcryptjs').compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
