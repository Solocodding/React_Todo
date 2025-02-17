const Task = require('../models/Task');
const User = require('../models/User');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id, isDeleted: false });
        const user = await User.findById(req.user.id);
        const notifications = user.notifications.reverse();
        const data = { tasks, notifications };
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const addTask = async (req, res) => {
    try {

        const newTask = new Task({
            taskStatus: req.body.taskStatus,
            taskDescription: req.body.taskDescription,
            client: req.body.client,
            taskDeadline: req.body.taskDeadline,
            taskProgress: req.body.taskProgress,
            userId: [req.user.id],
        });
        // console.log("newTask", newTask);

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const dndTask = async (req, res) => {
    try {
        // console.log(req.body.id, req.body.taskStatus);
        const task = await Task.findByIdAndUpdate(req.body.id, { taskStatus: req.body.taskStatus }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        //realtime update to other users
        let users =await Promise.all(
            task.userId.map(async (userId) => {
                const user = await User.findById(userId);
                return user.socketId;
            })
        )
        users = users.filter((user) => {
            return user !== req.user.socketId
        })
        users.forEach(socketId => {
            req.io.to(socketId).emit('refreshTask', task._id);
        });
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const updateTask = async (req, res) => {

    try {
        // console.log(req.body);
        if (req.body.taskProgress >= 10) {
            req.body.taskProgress = 10;
        } else if (req.body.taskProgress < 0) {
            req.body.taskProgress = 0;
        }

        const task = await Task.findByIdAndUpdate(req.params.id, {
            taskDescription: req.body.taskDescription,
            client: req.body.client,
            taskDeadline: req.body.taskDeadline,
            taskStatus: req.body.taskStatus,
            taskProgress: req.body.taskProgress
        }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        //realtime update to other users
        let users =await Promise.all(
            task.userId.map(async (userId) => {
                const user = await User.findById(userId);
                return user.socketId;
            })
        )
        users = users.filter((user) => {
            return user !== req.user.socketId
        })
        users.forEach(socketId => {
            req.io.to(socketId).emit('refreshTask', task._id);
        });
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const sharewith = async (req, res) => {

    if (req.body.email === req.user.email) {
        return res.status(400).json({ message: "You cannot share with yourself" });
    }

    try {
        // console.log(req.body.email, req.params.id);
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const email = req.body.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (task.userId.includes(user._id.toString())) {
            return res.status(400).json({ message: "Task already shared with this user" });
        }
        task.userId.push(user._id.toString());

        if (!user.taskBoards.includes(task.taskStatus)) {
            user.taskBoards.push(task.taskStatus);
        }

        const msg = `New Task shared with you: ${task.taskDescription},in ${task.taskStatus} phase`;
        user.notifications.push(msg);
        const data = { msg, task, taskBoard: task.taskStatus };
        req.io.to(user.socketId).emit('notification', data); //send real time update without refresh

        await task.save();
        await user.save();

        // console.log("check3");
        res.status(200).json({ message: "Task shared successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteTask = async (req, res) => {
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        const task = await Task.findById(req.params.taskId);
        console.log(req.params.userId);

        const index = task.userId.indexOf((userid) => { userid === req.params.userId });
        task.userId.splice(index, 1);
        if (task.userId.length === 0) {
            task.isDeleted = true;
        }
        await task.save();

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getTasks, addTask, dndTask, updateTask, sharewith, deleteTask };
