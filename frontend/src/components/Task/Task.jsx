import { useState, useEffect,useRef,useContext } from "react";
import progressIcon from "../../assets/progress.svg";
import commentsIcon from "../../assets/comments.svg";
import shareIcon from "../../assets/share.svg";
import more from "../../assets/more.svg";
import UpdateTask from "../../antdComponents/UpdateTask";
import Sharewith from "../../antdComponents/Sharewith";
import { message } from 'antd';
import { useDrag } from "react-dnd";
import {SocketContext} from "../../App";
function Task({ item, theme, setTasks }) {
    const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const handleRefresh = async () => {
        try {
          const response = await fetch(`${BASE_URL}/task`, {
            method: "GET",
            credentials: "include", // Include cookies
            headers: {
              "Content-Type": "application/json",
            },
          });
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
        } catch (error) {
          console.error("Error fetching tasks:", error.message);
        }
    };

    const {socket} = useContext(SocketContext);

    socket.on('refreshTask', (taskId) => {
        // console.log("refreshTask");
        setTasks((prevTasks) => {
            return prevTasks.map(task => task._id === taskId ? { ...task, refresh: true } : task);
        })
    })

    const scrollInterval =useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'task',
        item: { id: item._id, taskStatus: item.taskStatus },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    
    useEffect(() => {
        if(isDragging){
            document.addEventListener("dragover", handleAutoScroll);
        }else{
            document.removeEventListener("dragover", handleAutoScroll);
            clearInterval(scrollInterval.current);
        }
        return (() => {
            document.removeEventListener("dragover", handleAutoScroll);
            clearInterval(scrollInterval.current);
        })

    },[isDragging]);


    const handleAutoScroll = (event) => {
        const threshold = 50; // Distance from the edge to trigger scrolling
        const scrollSpeed = 10; // Speed of scrolling

        if(scrollInterval.current){
            clearInterval(scrollInterval.current);
        }

        if(event.clientY < threshold){
            scrollInterval.current = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            },50);
        }else if(event.clientY > window.innerHeight - threshold){
            scrollInterval.current = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            },50);
        }else{
            clearInterval(scrollInterval.current);
        }   
    };

    const [showOptions, setShowOptions] = useState(false);
    // const optionRef = useRef(null);

    const user=JSON.parse(localStorage.getItem('user'));

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {

            try {
                const response = await fetch(`${BASE_URL}/task/delete/${item._id}/${user._id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (response.ok) {
                    message.success("Task deleted successfully!");
                    // const data = await response.json();
                    setTasks((prevTasks) => {
                        return prevTasks.filter((task) => task._id !== item._id);
                    });
                    setShowOptions(false);
                } else {
                    // alert("Failed to delete task.");
                    message.error("Failed to delete task.");
                    setShowOptions(false);
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                setShowOptions(false);
            }
        }
        setShowOptions(false);
    };
    // useEffect(()=>{
    //     const handleClickOutside = (event) => {
    //         if (optionRef.current && !optionRef.current.contains(event.target)) {
    //             setShowOptions(false);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     }

    // },[]);

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`relative flex flex-col w-full p-4 ${theme === "dark" ? "bg-[#292B31]" : "bg-[#f9fafd]"} rounded-lg hover:cursor-move w-full max-w-[300px]`}
        >
            
            {
                item.refresh && 
                <button 
                    className="absolute right-2 top-0 cursor-pointer "
                    onClick={() => handleRefresh()}    
                >
                    🔄
                </button>
            }

            {/* Task Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p>{item.taskDescription}</p>
                    <p className="text-gray-400 text-sm">{item.client}</p>
                </div>
                <div className="relative">
                    <button
                        className={`flex items-center justify-center w-[28px] h-[28px] rounded-full ${theme === "dark" ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(232,170,170,0.16)]"}`}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <img src={more} alt="More"
                            style={theme === 'dark' ? { filter: 'invert(0)' } : { filter: 'invert(1)' }}
                        />
                    </button>
                    {showOptions && (
                        <div 
                            // ref={optionRef} 
                            className={`absolute right-0  ${theme === "dark" ? "bg-[#292B31]" : "bg-white"} shadow-lg rounded-lg flex flex-col`}>
                            <UpdateTask theme={theme} item={item} setTasks={setTasks} setShowOptions={setShowOptions} />
                            <Sharewith theme={theme} item={item} setShowOptions={setShowOptions} />
                            <button className="text-red-500 hover:underline mt-1" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Progress */}
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-400">
                        <img src={progressIcon} alt="Progress" />
                        Progress
                    </span>
                    <span>{item.taskProgress}/10</span>
                </div>
                <div className="w-full h-[4px] bg-gray-500 mt-2 rounded">
                    <div
                        className="h-full rounded"
                        style={{
                            width: `${(item.taskProgress / 10) * 100}%`,
                            backgroundColor:
                                item.taskProgress < 4 ? "#FFA51F" : item.taskProgress < 10 ? "#FFD700" : "#90EE90",
                        }}
                    ></div>
                </div>
            </div>

            {/* Task Footer */}
            <div className="flex items-center justify-between mt-4 text-gray-400">
                <span>
                    {new Date(item.taskDeadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <img src={commentsIcon} alt="Comments" />
                        {item.taskComments}
                    </span>
                    <span className="flex items-center gap-1">
                        <img src={shareIcon} alt="Share" />
                        {item.taskShare}
                    </span>
                </div>
            </div>

        </div>
    );
}

export default Task;
