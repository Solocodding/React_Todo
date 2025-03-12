import React, { useState } from 'react'
import Login from './antdComponents/Login'
import Signup from './antdComponents/Signup'
import Home from './components/Home'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import { createContext } from 'react'
import {io} from 'socket.io-client';

const SocketContext=createContext();

const router=createBrowserRouter(
  [
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/auth",
      // element:<Login/>,
      children:[
        {
          path:"login",
          element:<Login/>
        },
        {
          path:"signup",
          element:<Signup/>
        }
      ]
    },
    
  ]
);
const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
function App() {
  const [loggedin, setLoggedIn] = useState(false);
  const socket = io(`${BASE_URL}`);
  return (
    <SocketContext.Provider value={{socket,loggedin,setLoggedIn}}>
      <RouterProvider router={router} /> 
    </SocketContext.Provider>
  );

}

export {SocketContext};
export default App
