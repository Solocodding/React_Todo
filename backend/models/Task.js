const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    taskStatus: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    taskDeadline: {
        type: String,
        required: true
    },
    taskProgress: {
        type: Number,
        default: 0
        //default: taskStatus === "Done" ? 10 : taskStatus === "In Progress" ? 7 : 3
    },
    refresh: {
        type: Boolean,
        default: false
    },
    taskComments: {
        type: Number,
        default: 0
    },
    taskShare: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId:{
        type: Array,
        default: []
    },
});

module.exports = mongoose.model("Task", TaskSchema);