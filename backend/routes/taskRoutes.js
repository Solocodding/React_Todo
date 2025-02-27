const express = require('express');
const router = express.Router();
const { getTasks, addTask, dndTask, updateTask,sharewith, deleteTask} = require('../controllers/taskController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, getTasks);

router.post('/add', verifyToken, addTask);
router.put('/dnd', verifyToken, dndTask);
router.put('/update/:id', verifyToken, updateTask);
router.put('/sharewith/:id', verifyToken, sharewith);
router.delete('/delete/:taskId/:userId', verifyToken, deleteTask);

module.exports = router;