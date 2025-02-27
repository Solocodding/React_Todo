import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Sidebar/logo.svg'
import ovals from '../../assets/Sidebar/ovals.svg'
import icon from '../../assets/Sidebar/icon.svg'
import profile from '../../assets/Sidebar/profile.svg'
import calendar from '../../assets/Sidebar/calendar.svg'
import statics from '../../assets/Sidebar/statics.svg'
import upload from '../../assets/Sidebar/upload.svg'
import nextpage from '../../assets/Sidebar/nextpage.svg'
import links from '../../assets/Sidebar/links.svg'
import logout from '../../assets/Sidebar/logout.svg'
import Cookie from 'js-cookie'
import Report from '../../antdComponents/report'
function Sidebar({setProjectvisible, tasks, taskBoards}) {
    const [reportvisible, setReportvisible] = useState(false);
    const navigate = useNavigate();
    function toggleProjectview(){
        setProjectvisible((prev)=>!prev);
    }
    function toggleReportview(){
        setReportvisible((prev)=>!prev);
    }
    return (
        <>
            <div className="bg-[#1C1D22] flex items-center justify-center w-full  max-w-[70px] h-screen overflow-y-auto">
                <img src={ovals} alt="Ovals" className='absolute top-[24px]'/>
                <img src={logo} alt="Logo" 
                    onClick={toggleProjectview}
                    className='absolute top-[70px] cursor-pointer'/>
                <div className='flex flex-col absolute top-[131px]'>
                    <div className="flex items-center justify-center w-full max-w-[48px] h-full max-h-[48px] rounded-full bg-[rgba(255,255,255,0.1)]">  
                        <img src={icon} alt="Icon"/>
                    </div>
                    <img src={profile} alt="Profile" className='absolute top-[50px]'/>
                    <img src={calendar} alt="Calendar" className='absolute top-[100px]'/>
                    <img src={statics} alt="Statics" className='absolute top-[150px] cursor-pointer' onClick={toggleReportview} />
                    <img src={upload} alt="Upload" className='absolute top-[200px]'/>
                    <img src={nextpage} alt="Nextpage" className='absolute top-[250px]'/>
                    <img src={links} alt="Links" className='absolute top-[300px]'/>
                </div>
                    <img src={logout} alt="Logout" className='absolute bottom-[25px] hover:cursor-pointer'
                        onClick={()=>{
                            if(confirm("Are you sure you want to logout?")){
                                Cookie.remove('authToken');
                                localStorage.removeItem('user');
                                window.location.href = '/';
                                // navigate('/');
                            }
                        }}  
                    />
            </div>

            {/* Report Modal */}
            {reportvisible && (
                <div className="z-1 fixed inset-0 bg-black  flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-[400px] ">
                        <button className="absolute top-2 right-2 text-xl font-bold cursor-pointer" onClick={toggleReportview}>
                            ✖
                        </button>
                        <Report tasks={tasks} taskBoards={taskBoards} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar