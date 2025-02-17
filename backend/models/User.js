const mongoose= require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type:String,
        default:"",
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    taskBoards: {
        type: Array,
        default: [],
    },
    notifications:{
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }  
});

module.exports = mongoose.model('User', UserSchema);