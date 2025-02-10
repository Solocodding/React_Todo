const cors = require('cors');

require ('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// Allow CORS from specific origin
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, authentication headers, etc.)
  })
);
//Routes
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');
const viewRoutes = require('./routes/viewRoutes.js');


//Middleware
// app.use(cors());
app.use(express.json());
app.use(cookieParser());    

const connectDB = require('./config/db');
connectDB(); //connect to Database

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/view", viewRoutes);  

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});