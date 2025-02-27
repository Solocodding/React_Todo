import more from "../../assets/more.svg";
import AddNewBoard from "../../antdComponents/AddNewBoard";
import { useState } from "react";
import DeleteTaskBoard from "../../antdComponents/DeleteTaskBoard";

function Menu({theme,setTaskBoards}) {

    const [showOptions, setShowOptions] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between  w-full  h-[50px]  ml-4 mr-4 mt-2 ">
                <div className="flex items-center gap-2">
                    <span>Board view</span>
                    <AddNewBoard theme={theme} setTaskBoards={setTaskBoards}/>
                </div>
                <div>
                    <span className="flex items-center gap-2">
                        <p>Filter</p>
                        <p>sort</p>
                        <div className="relative">
                            <button
                                className={`flex items-center justify-center w-[28px] h-[28px] rounded-full ${theme === "dark" ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(232,170,170,0.16)]"
                                    }`}
                                onClick={() => setShowOptions(!showOptions)}
                            >
                            <img src={more} alt="More" 
                            style={{filter: theme === "dark" ? "invert(0)" : "invert(1)"}}/>
                            </button>
                            {showOptions && (
                                <div className={`absolute right-0  ${theme === "dark" ? "bg-[#292B31]" : "bg-white"} shadow-lg rounded-lg flex flex-col`}>
                                    <DeleteTaskBoard theme={theme} setTaskBoards={setTaskBoards} setShowOptions={setShowOptions}/>
                                </div>
                            )}
                        </div>
                        <span className={`flex items-center justify-center gap-0.5 text-white ${theme === "dark" ? "bg-[rgb(72,102,225)]" : "bg-[#1C1D22]"} p-1 px-2 rounded-[22px]`}>New template</span>
                    </span>
                </div>
            </div>
            
            <hr className="w-full h-1 mt-2"></hr>
        </>
    )
}   

export default Menu