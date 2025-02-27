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
function App() {
  return (
    <SocketContext.Provider value={io('http://localhost:8181')}>
      <RouterProvider router={router} /> 
    </SocketContext.Provider>
  );

}

export {SocketContext};
export default App
