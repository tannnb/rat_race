import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'

import reportWebVitals from './reportWebVitals'
import Home from './page/Home'
import Login from './page/Login'
import ErrorPage from './page/ErrorPage'
import Menu from './page/Menu'
import UserManage from './page/UserManage'
import ModifyMenu from './page/ModifyMenu'
import InfoModify from './page/InfoModify'
import PasswordModify from './page/PasswordModify'
import MeetingRoomManage from './page/MeetingRoomManage'
import Statistics from './page/Statistics'
import BookingManage from './page/BookingManage'

const routes = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <MeetingRoomManage />,
          },
          {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage />,
          },
          {
            path: 'user_manage',
            element: <UserManage />,
          },
          {
            path: 'booking_manage',
            element: <BookingManage />,
          },
          {
            path: 'statistics',
            element: <Statistics />,
          },
        ],
      },
      {
        path: '/user',
        element: <ModifyMenu />,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify />,
          },
          {
            path: 'password_modify',
            element: <PasswordModify />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]

const router = createBrowserRouter(routes)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router}></RouterProvider>)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
