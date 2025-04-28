import { useEffect } from 'react';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Chat from './Components/Chat';
import EditProfile from './Components/EditProfile';
import Explore from './Components/Explore';
import Home from './Components/Home';
import Profile from './Components/Profile';
import MainLayout from './Routing/MainLayout'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import {io} from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from './Components/redux/chatSlice';
import { setSocket } from './Components/redux/socketSlice';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute';

const browserRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />  // ✅ Redirect to /login
  },
  {
    path: "/app",
    element:<ProtectedRoute> <MainLayout /></ProtectedRoute>
    ,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "chat",
        element: <ProtectedRoute><Chat /></ProtectedRoute>,
      },
      {
        path : 'explore',
        element : <ProtectedRoute><Explore /></ProtectedRoute>
      },
      {
        path : 'edit-profile',
        element : <ProtectedRoute><EditProfile /></ProtectedRoute>
      },
      
    ],
    
  },
  
]);
function App() {
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio);

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id,
        },
        transports: ['websocket'], // corrected spelling
      });
  
      dispatch(setSocket(socketio)); // store socket in Redux
  
      socketio.on('getOnlineUsers', (onlineUsers) => {
        console.log('Online Users:', onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });
  
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  

  return (
    <>
    <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
