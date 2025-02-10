import {useState} from 'react'
import Search from '../../assets/Header/search.svg'
import Notification from '../../assets/Header/Notifications.svg'
import calendar from '../../assets/Sidebar/calendar.svg'
function Header({theme,tasks}) {
    const [showNotifications, setShowNotifications] = useState(false);
    function toggleNotifications() {
        setShowNotifications((prev) => !prev);
    }
    return (
        <>
            <div className="flex items-center justify-between w-full ">
                <p className="">Welcome back,Vincent</p>
                <div className={`relative flex items-center gap-3 `}>
                    <img src={Search} alt="Search" 
                        style={{
                            filter: theme === 'dark' ? 'invert(0)' : 'invert(1)'
                        }}    
                    />
                    <img src={Notification} alt="Notification"
                        style={{
                            filter: theme === 'dark' ? 'invert(0)' : 'invert(1)'
                        }} 
                        onClick={toggleNotifications}
                        className='cursor-pointer'
                    />

                    {showNotifications && (
                        <div className={`absolute top-10  ${theme === 'dark' ? 'bg-[#292B31]' : 'bg-white'} max-w-[300px] max-h-[150px] shadow-lg rounded-lg flex flex-col p-2 z-1 overflow-y-auto hide-scrollbar`}>                        
                            <p>All Notifications</p>
                            {tasks.filter((task) => 
                                task.taskProgress < 10 && 
                                (new Date(task.taskDeadline) - new Date() <= 2 * 24 * 60 * 60 * 1000) // 2 days(in milliseconds)
                            ).map((task,index)=>
                                (<p 
                                    key={index}
                                    className='flex items-center gap-2 p-2 cursor-pointer text-red-400'
                                >
                                    Deadline of {task.taskDescription } in {task.taskStatus} phase is too close
                                </p>))}
                        </div>
                    )}

                    <span className='flex items-center justify-center gap-1 ]'>
                        <img src={calendar} alt="Calendar"
                            style={{
                                filter: theme === 'dark' ? 'invert(0)' : 'invert(1)'
                            }} 
                        />
                        <p>{new Date(Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            })}</p>
                    </span>
                    <span className='w-[34px] h-[34px] rounded-full bg-[rgb(230,252,88)]'>
                        
                    </span>
                </div>
            </div>
        </>
    )
}

export default Header