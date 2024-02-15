import { Navigate, useRoutes } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import Layout from './layouts'

import Wallpaper from './components/Wallpaper'
import Home from './page/Home'
import Setting from './page/Setting'
import Tidal from './page/Tidal'

const HomePage = ({ time, location }) => {
  return (
    <>
      <Wallpaper time={time} location={location} />
      <Home time={time} location={location} />
    </>
  )
}

const AllRoutes = ({ time, location }) => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: <HomePage time={time} location={location} /> },
        { path: '/setting', element: <Setting /> },
        { path: '/tidal', element: <Tidal /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])
  return routes
}

export default AllRoutes
