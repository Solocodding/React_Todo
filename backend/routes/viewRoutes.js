const express = require('express');
const router = express.Router();
const {getViews, addView, updateView, deleteView} = require('../controllers/viewController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, getViews);
router.post('/add', verifyToken, addView);
router.post('/update', verifyToken, updateView);
router.delete('/delete/:viewName', verifyToken, deleteView);

module.exports = router;