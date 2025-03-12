const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, (req, res) => {
    if (!req.isAuthenticated) {
        return res.status(401).json({ message: "Access denied" });
    }
    res.status(200).json({ user: req.user , message: "Access granted" });
})

module.exports = router;