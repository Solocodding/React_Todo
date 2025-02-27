import Task from './Task';
import TodoDialog from '../../antdComponents/todoDialog';
import DropZone from './DropZone';
import { message } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

export default function TaskBoard({theme, status, index, tasks, setTasks,moveBoard }) {
    
    const ref=useRef(null);
    const handleDnd = async (task, taskStatus) => {
        try {
          const response = await fetch("http://localhost:8181/task/dnd", {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: task.id, taskStatus: taskStatus }),
          });
    
          if (!response.ok) {
            // message.error("Failed to update task status");
            return;
          }
    
          const data = await response.json();
          message.success("Task status updated successfully!");
          setTasks(prevTasks => prevTasks.map(task => task._id === data._id ? data : task));
    
        } catch (error) {
          console.error("Error creating todo:", error);
        }
      };


    const [{ isDragging }, drag] = useDrag({
        type: 'TASKBOARD',
        item: { index },
        collect: (monitor)=>({
            isDragging:monitor.isDragging(),
        })
    })

    const [, drop] = useDrop({                                                      
        accept: 'TASKBOARD',
        drop: (draggedBoard) => {
            if (draggedBoard.index !== index) {
                moveBoard(draggedBoard.index, index);
                draggedBoard.index = index;
            }
        },
    })
    drag(drop(ref));
    
    return (
        <div
            ref={ref} 
            key={status}
            className={`flex flex-col  w-full max-w-[300px] h-full max-h-[600px] rounded-lg p-4 overflow-y-auto hide-scrollbar border border-dashed border-gray-500 ${theme === 'light' ? 'bg-white' : 'bg-[#24262C]'
                }`}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-400">
                    {status} ({tasks.filter((item) => item.taskStatus === status).length})
                </p>
                <span className="flex items-center space-x-2">
                    <TodoDialog
                        theme={theme}
                        status={status} // Pass the board status to set status of new task
                        onTodoAdded={(newTask) => setTasks((prevTasks) => [...prevTasks, newTask])}
                    />
                </span>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-4 mt-4">
                {tasks
                    .filter((item) => item.taskStatus === status)
                    .map((item, index) => (
                        <Task key={`${status}-${index}`} item={item} theme={theme}
                            setTasks={setTasks}
                        />
                    ))}
                <DropZone key={`${status}-${index}`} theme={theme} handleDnd={handleDnd} DropZoneStatus={status} />
            </div>
        </div>
    )
}