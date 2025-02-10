import Task from "./Task";
import TodoDialog from "../../antdComponents/todoDialog";
import DropZone from "./DropZone";
import { message } from "antd";
import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";

const ItemType = {
  TASKBOARD: "TASKBOARD",
};

export default function TaskBoard({ tasks, theme, taskBoards, setTasks, setTaskBoards }) {
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
        return;
      }

      const data = await response.json();
      message.success("Task status updated successfully!");
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === data._id ? data : task)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const moveBoard = (fromIndex, toIndex) => {
    setTaskBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const [movedBoard] = updatedBoards.splice(fromIndex, 1);
      updatedBoards.splice(toIndex, 0, movedBoard);
      return updatedBoards;
    });
  };

  return (
    <div className="flex flex-wrap lg:flex-row justify-center w-full gap-4 mt-4 overflow-y-auto hide-scrollbar">
      {taskBoards.map((status, index) => (
        <DraggableBoard
          key={status}
          index={index}
          status={status}
          theme={theme}
          tasks={tasks}
          setTasks={setTasks}
          moveBoard={moveBoard}
          handleDnd={handleDnd}
        />
      ))}
    </div>
  );
}

function DraggableBoard({ status, index, theme, tasks, setTasks, moveBoard, handleDnd }) {
  const ref = useState(null);

  const [, drop] = useDrop({
    accept: ItemType.TASKBOARD,
    hover: (draggedBoard) => {
      if (draggedBoard.index !== index) {
        moveBoard(draggedBoard.index, index);
        draggedBoard.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASKBOARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex flex-col w-full max-w-[300px] h-full max-h-[600px] rounded-lg p-4 overflow-y-auto hide-scrollbar border border-dashed border-gray-500 ${theme === "light" ? "bg-white" : "bg-[#24262C]"}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          {status} ({tasks.filter((item) => item.taskStatus === status).length})
        </p>
        <span className="flex items-center space-x-2">
          <TodoDialog
            theme={theme}
            status={status}
            onTodoAdded={(newTask) => setTasks((prevTasks) => [...prevTasks, newTask])}
          />
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {tasks
          .filter((item) => item.taskStatus === status)
          .map((item, index) => (
            <Task key={`${status}-${index}`} item={item} theme={theme} setTasks={setTasks} />
          ))}
        <DropZone key={`${status}-drop`} theme={theme} handleDnd={handleDnd} DropZoneStatus={status} />
      </div>
    </div>
  );
}


////////////////////


import DraggableBoard from "./DraggableBoard";
import { message } from "antd";
import { useDrop } from "react-dnd";

export default function TaskBoard({ tasks, theme, taskBoards, setTasks, setTaskBoards }) {
    
    // Function to move a board within taskBoards
    const moveBoard = (fromIndex, toIndex) => {
        setTaskBoards((prevBoards) => {
            const updatedBoards = [...prevBoards];
            const [movedBoard] = updatedBoards.splice(fromIndex, 1);
            updatedBoards.splice(toIndex, 0, movedBoard);
            return updatedBoards;
        });
    };

    // Making the entire board container droppable
    const [, drop] = useDrop({
        accept: "TASKBOARD",
        hover: (draggedItem) => {
            if (draggedItem.index !== draggedItem.hoveredIndex) {
                moveBoard(draggedItem.index, draggedItem.hoveredIndex);
                draggedItem.index = draggedItem.hoveredIndex;
            }
        },
    });

    return (
        <div
            ref={drop}
            className="flex flex-wrap lg:flex-row justify-center w-full gap-4 mt-4 overflow-y-auto hide-scrollbar border border-dashed border-gray-500"
        >
            {taskBoards.map((status, index) => (
                <DraggableBoard
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
    );
}



/////////////

import Task from "./Task";
import TodoDialog from "../../antdComponents/todoDialog";
import DropZone from "./DropZone";
import { useDrag, useDrop } from "react-dnd";

export default function DraggableBoard({ theme, status, index, tasks, setTasks, moveBoard }) {
    // Drag logic for boards
    const [{ isDragging }, drag] = useDrag({
        type: "TASKBOARD",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Drop logic for boards
    const [, drop] = useDrop({
        accept: "TASKBOARD",
        hover: (draggedBoard) => {
            if (draggedBoard.index !== index) {
                moveBoard(draggedBoard.index, index);
                draggedBoard.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            key={status}
            className={`flex flex-col w-full max-w-[300px] h-full max-h-[600px] rounded-lg p-4 overflow-y-auto hide-scrollbar border border-dashed border-gray-500 ${
                theme === "light" ? "bg-white" : "bg-[#24262C]"
            }`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
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
                        <Task key={`${status}-${index}`} item={item} theme={theme} setTasks={setTasks} />
                    ))}
                <DropZone key={`${status}-dropzone`} theme={theme} DropZoneStatus={status} />
            </div>
        </div>
    );
}


///////
