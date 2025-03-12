import { useState, useEffect,useContext } from 'react';
import Search from '../../assets/Header/Search.svg';
import Notification from '../../assets/Header/Notifications.svg';
import calendar from '../../assets/Sidebar/calendar.svg';
import { SocketContext } from '../../App';
import Profile from './Profile';

function Header({ theme, tasks, setTasks,taskBoards, setTaskBoards, notifications, setNotifications }) {
    const newUser=JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(newUser);

    const [showNotifications, setShowNotifications] = useState(false);

    const {socket} = useContext(SocketContext);

    useEffect(() => {
        socket.on('notification', (data) => {
            // console.log(data);
            setNotifications((prev) => [data.msg, ...prev]);

            if(data.task && !tasks.includes(data.task)){
                setTasks((prev)=> [...prev, data.task]);
            }
            if(data.taskBoard && !taskBoards.includes(data.taskBoard)){
                setTaskBoards((prev)=> [...prev, data.taskBoard]);
            }
        });
        return () => {
            socket.off('notification');
        };
    },[socket,tasks,taskBoards]);
    
    useEffect(() => {
        const allNotifications = [...notifications];

        tasks.forEach((task) => {
            if (
                task.taskProgress < 10 &&
                new Date(task.taskDeadline) - new Date() <= 2 * 24 * 60 * 60 * 1000 &&
                new Date(task.taskDeadline) - new Date() >= 0
            ) {
                const index = allNotifications.findIndex((notification)=> notification === `Deadline of task: ${task.taskDescription}, in ${task.taskStatus} phase is too close`);
                allNotifications.splice(index, 1);

                allNotifications.push(`Deadline of task: ${task.taskDescription}, in ${task.taskStatus} phase is too close`);
            }
        });
        setNotifications(allNotifications);
    }, [tasks]); 
    function toggleNotifications() {
        setShowNotifications((prev) => !prev);
    }

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <p>Welcome back,{user.username}</p>
                <div className={`relative flex items-center gap-3`}>
                    <img
                        src={Search}
                        alt="Search"
                        style={{
                            filter: theme === 'dark' ? 'invert(0)' : 'invert(1)',
                        }}
                    />
                    <img
                        src={Notification}
                        alt="Notification"
                        style={{
                            filter: theme === 'dark' ? 'invert(0)' : 'invert(1)',
                        }}
                        onClick={toggleNotifications}
                        className="cursor-pointer"
                    />

                    {showNotifications && (
                        <div
                            className={`absolute top-10 ${
                                theme === 'dark' ? 'bg-[#292B31]' : 'bg-white'
                            } max-w-[300px] max-h-[150px] shadow-lg rounded-lg flex flex-col p-2 z-1 overflow-y-auto hide-scrollbar`}
                        >
                            <p>All Notifications</p>
                            {notifications.map((notification, index) => (
                                <p
                                    key={index}
                                    className="flex items-center gap-2 p-2 cursor-pointer text-red-400"
                                >
                                    {notification}
                                </p>
                            ))}
                        </div>
                    )}

                    <span className="flex items-center justify-center gap-1">
                        <img
                            src={calendar}
                            alt="Calendar"
                            style={{
                                filter: theme === 'dark' ? 'invert(0)' : 'invert(1)',
                            }}
                        />
                        <p>
                            {new Date(Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </span>
                        <Profile theme={theme}></Profile>
                </div>
            </div>
        </>
    );
}

export default Header;
