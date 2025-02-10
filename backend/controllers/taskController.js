const Task = require('../models/Task');
const User = require('../models/User');

const getTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user.id , isDeleted: false});
      res.status(200).json(tasks);
      
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
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const updateTask = async (req, res) => {
    try {
        // console.log(req.body);
        if(req.body.taskProgress >=10){
            req.body.taskProgress =10;
        }else if(req.body.taskProgress <0){
            req.body.taskProgress =0;
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
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const sharewith= async(req, res) => {
    try {
        // console.log(req.body.email, req.params.id);

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const email= req.body.email;
        const user= await User.find({email});

        // console.log(user[0]._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        task.userId.push(user[0]._id.toString());
        await task.save();
        // console.log("check3");
        res.status(200).json({message: "Task shared successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({task, message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


module.exports = {getTasks, addTask, dndTask, updateTask,sharewith, deleteTask };
