const User = require('../models/User');
const uploadUserPhoto = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        console.log(req.body.userId);////////////////
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const filePath = `/uploads/${req.body.userId}.jpg`;

        user.profilePic = filePath;
        await user.save();
        res.status(200).json({ message: "Profile picture updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });    
    }
}
module.exports = { uploadUserPhoto };