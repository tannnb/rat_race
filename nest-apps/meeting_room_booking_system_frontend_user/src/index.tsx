import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'

import reportWebVitals from './reportWebVitals'
import Home from './page/Home'
import Login from './page/Login'
import Register from './page/Register'
import UpdatePassword from './page/UpdatePassword'
import ErrorPage from './page/ErrorPage'
import UpdateInfo from './page/UpdateInfo'
import Menu from './page/Menu'
import MeetingRoomList from './page/MeetingRoomList'
import BookingHistory from './page/BookingHistory'

const routes = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />,
      },
      {
        path: '/',
        element: <Menu />,
        children:[
          {
            path: '/',
            element: <MeetingRoomList />,
          },
          {
            path: 'meeting_room_list',
            element: <MeetingRoomList />,
          },
          {
            path: 'booking_history',
            element: <BookingHistory />,
          },
        ]
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/UpdatePassword',
    element: <UpdatePassword />,
  },
]

const router = createBrowserRouter(routes)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router}></RouterProvider>)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
