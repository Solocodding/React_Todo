import Login from './antdComponents/Login'
import Signup from './antdComponents/Signup'
import Home from './components/Home'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'


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
    <>
      <RouterProvider router={router} /> 
    </>
  );

}

export default App
