
const cors = require('cors');
const User = require('./models/User');
const path = require('path');

require ('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const cookieParser = require('cookie-parser');

const {Server}=require('socket.io');

const allowedOrigins = [
  "http://localhost:5173",  // Local development
  "https://task-management-phi-ten.vercel.app",  // Vercel frontend
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,  // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});
// Allow CORS from specific origin
app.use(
  cors({
    origin: allowedOrigins,  // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // Allow cookies to be sent
  })
);
//Routes
const dashBoardRoutes = require('./routes/dashBoardRoutes.js');
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

app.use("/", dashBoardRoutes);
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