
const cors = require('cors');
const User = require('./models/User');
const path = require('path');

require ('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const cookieParser = require('cookie-parser');

const {Server}=require('socket.io');

const io=new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST",'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});


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
const profileRoutes = require('./routes/profileRoutes.js');

//Middleware
app.use(express.json());
app.use(cookieParser());   
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

const connectDB = require('./config/db');
connectDB(); //connect to Database

app.use((req,res,next)=>{
  req.io=io;
  next();
})

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/view", viewRoutes); 
app.use("/profile", profileRoutes); 

io.on('connection', (socket) => {
  
  socket.on('updateSocketId', async({ email, socketId }) => {  
    try{
      const user= await User.findOneAndUpdate({email},{socketId:socketId},{new:true});
    }catch(err){
      console.log(err);
    }
  })

})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});