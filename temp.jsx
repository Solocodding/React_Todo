import { useState, useEffect, useRef, useContext } from "react";
import { useDrag } from "react-dnd";
import { SocketContext } from "../../App";
import progressIcon from "../../assets/progress.svg";
import commentsIcon from "../../assets/comments.svg";
import shareIcon from "../../assets/share.svg";
import more from "../../assets/more.svg";
import UpdateTask from "../../antdComponents/UpdateTask";
import Sharewith from "../../antdComponents/Sharewith";
import { message } from "antd";

function Task({ item, theme, setTasks }) {
    const socket = useContext(SocketContext);
    const [showOptions, setShowOptions] = useState(false);
    const scrollInterval = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: "task",
        item: { id: item._id, taskStatus: item.taskStatus },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        begin: () => {
            document.addEventListener("dragover", handleAutoScroll);
        },
        end: () => {
            document.removeEventListener("dragover", handleAutoScroll);
            clearInterval(scrollInterval.current);
        },
    });

    const handleAutoScroll = (event) => {
        const threshold = 50; // Distance from the edge to trigger scrolling
        const scrollSpeed = 10; // Speed of scrolling

        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
        }

        if (event.clientY < threshold) {
            // Scroll up
            scrollInterval.current = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 50);
        } else if (event.clientY > window.innerHeight - threshold) {
            // Scroll down
            scrollInterval.current = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 50);
        } else {
            clearInterval(scrollInterval.current);
        }
    };

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`relative flex flex-col w-full p-4 ${theme === "dark" ? "bg-[#292B31]" : "bg-[#f9fafd]"} rounded-lg hover:cursor-move w-full max-w-[300px]`}
        >
            {item.refresh && (
                <button
                    className="absolute right-2 top-0 cursor-pointer"
                    onClick={() => handleRefresh()}
                >
                    🔄
                </button>
            )}

            {/* Task Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p>{item.taskDescription}</p>
                    <p className="text-gray-400 text-sm">{item.client}</p>
                </div>
                <div className="relative">
                    <button
                        className={`flex items-center justify-center w-[28px] h-[28px] rounded-full ${
                            theme === "dark" ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(232,170,170,0.16)]"
                        }`}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <img src={more} alt="More" style={theme === "dark" ? { filter: "invert(0)" } : { filter: "invert(1)" }} />
                    </button>
                    {showOptions && (
                        <div className={`absolute right-0 ${theme === "dark" ? "bg-[#292B31]" : "bg-white"} shadow-lg rounded-lg flex flex-col`}>
                            <UpdateTask theme={theme} item={item} setTasks={setTasks} setShowOptions={setShowOptions} />
                            <Sharewith theme={theme} item={item} setShowOptions={setShowOptions} />
                            <button className="text-red-500 hover:underline mt-1" onClick={handleDelete}>
                                Delete
                            </button>
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
                            backgroundColor: item.taskProgress < 4 ? "#FFA51F" : item.taskProgress < 10 ? "#FFD700" : "#90EE90",
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

useEffect(() => {
    if (isDragging) {
        document.addEventListener("dragover", handleAutoScroll);
    } else {
        document.removeEventListener("dragover", handleAutoScroll);
        clearInterval(scrollInterval.current);
    }

    return () => {
        document.removeEventListener("dragover", handleAutoScroll);
        clearInterval(scrollInterval.current);
    };
}, [isDragging]);