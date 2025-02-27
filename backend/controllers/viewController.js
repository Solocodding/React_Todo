const User = require("../models/User.js");
const addView = async (req, res) => {
    try {
        if(req.body.viewName ===""){
            return res.status(400).json({ message: "View name is required" });
        }
        const user= await User.findById(req.user.id);
        user.taskBoards.push(req.body.viewName);
        await user.save();
        res.status(200).json(user.taskBoards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const getViews = async (req, res) => {
    // console.log("getViews");
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({ message: "user does not exist" });
        }
        res.status(200).json(user.taskBoards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }   
}

const updateView= async(req,res)=>{

    try {
        if(!req.body.taskBoards){
            return res.status(400).json({ message: "user does not exist" });
        }
        const user= await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({ message: "user does not exist" });
        }
        // console.log(req.body.taskBoards); ///////////
        user.taskBoards=req.body.taskBoards;
        await user.save();
        res.status(200).json({message: "taskBoard re-arranged"});
    }catch(error) {
        res.status(500).json({message: "Something went wrong"});
    }
}

const deleteView = async (req, res) => {
    // console.log(req.params.viewName);
    try {
        const user = await User.findById(req.user.id);
        const boards=user.taskBoards;
        if(!boards.includes(req.params.viewName)){
            return res.status(400).json({ message: "taskBoard with given name does not exist" });
        }   
        user.taskBoards = user.taskBoards.filter(board => board !== req.params.viewName);
        await user.save();
        res.status(200).json(user.taskBoards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }   
}
module.exports = { addView, getViews, updateView, deleteView };