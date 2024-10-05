import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import Login from './layouts/Login.jsx';
import Signup from './layouts/Signup.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<App/>),
  },
  {
    path: "/:id",
    element: (<App/>),
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },
]);


createRoot(document.getElementById('root')).render(
  // <StrictMode>
      <RouterProvider router={router} />
  // </StrictMode>,
)
