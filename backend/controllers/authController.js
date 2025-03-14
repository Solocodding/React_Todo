const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    // console.log(req.body);
    // console.log(fullName,email,password,confirmPassword);

    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: fullName,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const options = {
            httpOnly: true,   // Prevent frontend JS from accessing it
            secure: true,     // Ensure it's sent over HTTPS
            sameSite: "None",
            maxAge: 60 * 60 * 1000,
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('authToken', token, options).status(200).json({
            success: true,
            user: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic },
            message: "Login successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const logout = async (req, res) => {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge:0, // Expire immediately
    });
    res.status(200).json({ message: "Logged out successfully" });
};
module.exports = { signup, login, logout };