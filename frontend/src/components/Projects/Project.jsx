import dropdown from '../../assets/dropdown.svg'
import closeup from '../../assets/closeup.svg'
import light from '../../assets/light.svg'
import dark from '../../assets/dark.svg'
import { useState } from 'react'

function Project({ data ,theme,setTheme }) {
    const [openDropdowns, setOpenDropdowns] = useState({});

    // Toggle the dropdown state for each task
    const toggleDropdown = (taskName) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [taskName]: !prev[taskName],
        }));
    };

    return (
        <>
            <div className={`relative flex flex-col items-center w-full  max-w-[218px] h-screen ${theme === 'dark' ? 'bg-[#222327]' : 'bg-white'} p-6 overflow-y-auto hide-scrollbar    `}>
                <div className="flex items-center justify-between w-full max-w-[200px] h-[30px] mt-[32px]  ">
                    <p className="">Projects</p>
                    <div className={`flex items-center justify-center w-[28px] h-[28px] rounded-full ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(232,170,170,0.16)]'}`}>
                        +
                    </div>
                </div>
                <div className="flex  flex-col  justify-between w-full max-w-[261px] h-full max-h-[572px] my-[18px]">
                    <div className="space-y-4">
                        {data.map((task) => (
                            <div key={task.name} className="relative">
                                
                                <div 
                                    onClick={() => toggleDropdown(task.name)}
                                    className='flex items-center justify-between w-full' >
                                    <span
                                        className={`flex items-center justify-between   py-1 rounded-[22px] `}>
                                        {task.name}
                                    </span>
                                    <span className='ml-2'>{openDropdowns[task.name] ? <img src={closeup} alt="closeup" /> : <img src={dropdown} alt="dropdown" style={{filter: theme === 'dark' ? 'invert(0)' : 'invert(1)'}} />}</span>
                                
                                </div>

                                {/* Subtasks Dropdown */}
                                {openDropdowns[task.name] && (
                                    <div className=" mt-2  rounded-lg shadow-lg">
                                        {/* Vertical Line */}
                                        <div className="absolute h-[80%] w-[1px] bg-gray-400"></div>
                                        <ul>
                                            {task.subtasks.map((subtask) => (
                                                <li
                                                    key={subtask.name}
                                                    className={`flex items-center space-x-2 py-1 rounded-[22px] ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-[rgba(242,242,242,0.98)]'}  whitespace-nowrap`}
                                                >
                                                    <span className="h-[1px] w-3 bg-gray-400"></span>
                                                    <span className={`text-gray-400 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'} `}>
                                                        {subtask.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`flex items-center justify-between ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-[rgba(242,242,242,0.98)]'}  w-full max-w-[262px] h-full max-h-[42px] rounded-[22px] mt-[18px] p-2`}>
                    <button 
                        onClick={() => setTheme('light')}
                        className={` ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.04)] ' : 'bg-[rgba(255,255,255,1)] ' } flex items-center justify-center  rounded-[22px] mr-2 p-1 `}>
                            <img src={light} alt="Light" 
                            style={theme === 'dark' ? {filter: 'invert(0)'} : {filter: 'invert(1)'} }
                            />Light
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={` ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.4)]' : 'bg-[rgba(242,242,242,0.98)]'} flex items-center justify-center  rounded-[22px] ml-[4px] mr-2 p-1`}>
                            <img src={dark} alt="Dark" 
                            style={theme === 'dark' ? {filter: 'invert(0)'} : {filter: 'invert(1)'} }
                            className="ml-2"/>Dark
                    </button>
                </div>
            </div>
        </>
    )
}

export default Project