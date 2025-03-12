import { useState, useEffect,useContext } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Headers/Header';
import Menu from './Menu/Menu';
import Project from './Projects/Project';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { message } from 'antd';
import TaskBoard from './Task/TaskBoard';
import { SocketContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [projectvisible, setProjectvisible] = useState(true);
  const [tasks, setTasks] = useState([]);
  // const [loggedin, setLoggedIn] = useState(false);
  const [taskBoards, setTaskBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const {socket,loggedin,setLoggedIn} = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return; 

    function handleConnect() {
      const user=JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email; 
        if (userEmail) {
            socket.emit("updateSocketId", { email: userEmail, socketId: socket.id });
        }
        console.log("Socket connected:", socket.id, userEmail);
    };
    socket.on("connect", handleConnect);

    return () => {
        socket.off("connect", handleConnect);
    };
  }, [socket,loggedin]);
  
  const data = [
    {
      name: "Team",
      subtasks: [],
    },
    {
      name: "Projects",
      subtasks: [
        { name: "All Projects (3)" },
        { name: "Design System" },
        { name: "User Flow" },
        { name: "UX Research" },
      ],
    },
    {
      name: "Tasks",
      subtasks: [
        { name: `All Tasks (${tasks.length})` },
        ...taskBoards.map((board) => ({ name: `${board} (${tasks.filter(item => item.taskStatus === board).length})` })),
      ],
    },
    {
      name: "Reminders",
      subtasks: [],
    },
    {
      name: "Messengers",
      subtasks: [],
    },
  ];

  useEffect(() => {
    try{
      (async ()=>{
        const response =await fetch(`${BASE_URL}/`, {
          method: "GET",
          credentials: "include", // Include cookies
        });
        if(response.status === 200){
          setLoggedIn(true);
          const result = await response.json();
          localStorage.setItem('user',JSON.stringify(result.user));
          console.log("User:",result.user);
        }else{
          setLoggedIn(false); 
        }
        setLoading(false);
      })();
    }catch(error){
      console.error("Error while accessing dashboard:", error.message);
    }
  }, []);

  // useEffect(() => {
  //   const token = Cookies.get("authToken");
  //   // console.log(token);
  //   if (token) {
  //     setLoggedIn(true);
  //   } else {
  //     setLoggedIn(false);
  //   }
  //   setLoading(false);
  // }, []);

  // Fetch tasks when loggedin is true
  useEffect(() => {
    const fetchTasks = async () => {
      if (!loggedin) {
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/task`, {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });
        // console.log(response);/
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(prevTasks => {
          if (JSON.stringify(prevTasks) !== JSON.stringify(data.tasks)) {
            return data.tasks;
          }
          return prevTasks;
        });
        setNotifications(data.notifications);
        // console.log(data.notifications);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    if (loggedin) {
      fetchTasks();
    }
  }, [loggedin]);

  useEffect(() => {
    // console.log("fetching task boards");
    if (!loggedin) {
      return;
    }
    const fetchTaskBoards = async () => {
      try {
        const response = await fetch(`${BASE_URL}/view`, {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task boards");
        }
        const data = await response.json();
        // console.log(data); ////////////////
        setTaskBoards(prevboards => {
          if (JSON.stringify(prevboards) !== JSON.stringify(data)) {
            return data;
          }
          return prevboards;
        });
      } catch (error) {
        console.error("Error fetching task boards:", error.message);
      }
    };
    if (loggedin) {
      fetchTaskBoards();
    }
  }, [loggedin]);


  const moveBoard = async (fromIndex, toIndex) => {
    setTaskBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const [movedBoard] = updatedBoards.splice(fromIndex, 1);
      updatedBoards.splice(toIndex, 0, movedBoard);
      updateTaskBoardsOnServer(updatedBoards);
      return updatedBoards;
    });
  };
  
  const updateTaskBoardsOnServer = async (updatedBoards) => {
    try {
      const response = await fetch(`${BASE_URL}/view/update`, {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskBoards: updatedBoards }), // Send latest data
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task boards");
      }
      message.success("Task boards re-arranged successfully!");
    } catch (error) {
      console.error("Error updating task boards:", error.message);
    }
  };
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {loggedin ? (
        <div
          className={`flex flex-col md:flex-row ${theme === 'light' ? 'bg-[#F2F2F2] text-[#2A2B2F]' : 'bg-[#2A2B2F] text-[#F2F2F2]'
            } h-screen overflow-hidden`}
        >
          {/* Sidebar */}
          <Sidebar setProjectvisible={setProjectvisible} tasks={tasks} taskBoards={taskBoards} setLoggedIn={setLoggedIn} />

          {/* Main  Content */}
          <div className={`${projectvisible ? 'block' : 'hidden'} `}>
            <Project data={data} theme={theme} setTheme={setTheme} />
          </div>

          {/* Board Area */}
          <div className="flex  flex-col items-center  w-full h-full p-4">
            {/* Header */}
            <Header theme={theme} tasks={tasks} setTasks={setTasks} taskBoards={taskBoards} setTaskBoards={setTaskBoards} notifications={notifications} setNotifications={setNotifications} />

            {/* Menu */}
            <Menu theme={theme} setTaskBoards={setTaskBoards} />

            {/* Task Board */}
            <div className="flex flex-wrap lg:flex-row justify-center w-full  gap-4 mt-4 overflow-y-auto hide-scrollbar ">
              {taskBoards.map((status, index) => (
                <TaskBoard
                  key={status}
                  theme={theme}
                  status={status}
                  index={index}
                  tasks={tasks}
                  setTasks={setTasks}
                  moveBoard={moveBoard}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // <Login setLoggedIn={setLoggedIn}/>
        navigate("/auth/login")
      )}
    </ DndProvider>
  );
}

export default Home;
