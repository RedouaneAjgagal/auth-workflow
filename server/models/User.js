const mongoose = require('mongoose');
const bcryptJS = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required!'],
        minLength: [3, 'User name must be 3 characters and more'],
        maxLength: [20, 'User name must less than 20 characters']
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'Email is required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [6, 'Password must be 6 characters and more'],
        maxLength: [30, 'Password must be less than 30 characters'],
    },
    verificationToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Date
    },
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcryptJS.genSalt(10);
    const hashedPassword = await bcryptJS.hash(this.password, salt);
    this.password = hashedPassword
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isCorrectPassword = await bcryptJS.compare(candidatePassword, this.password);
    return isCorrectPassword;
}

const User = mongoose.model('User', userSchema);

module.exports = User;