import React from "react";
import { useDrop } from "react-dnd";
import { message } from "antd";

function DropZone({ theme, handleDnd, DropZoneStatus }) {

    const [{isOver}, drop]=useDrop(()=>({
        accept:"task",
        drop:(task)=>{
            if(task.taskStatus === DropZoneStatus){
                // message.error("Task already in this status");
                return ;
            }   
            handleDnd(task, DropZoneStatus)
        },
        collect:(monitor)=>({
            isOver:monitor.isOver(),
        }),
    }));
    return (
        <div ref={drop}
            className={`dropzone flex flex-col w-full h-[160px] justify-center items-center p-4 ${theme === "dark" ? "bg-[#292B31]" : "bg-[#f9fafd]"} rounded-lg border border-dashed border-gray-500 `}>
            <p>Drop here to add task</p>
        </div>
    )
}


export default DropZone