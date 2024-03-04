import { Navigate, useRoutes } from 'react-router-dom'

import Layout from '@/layouts'
import Home from '@/page/Home'
import Setting from '@/page/Setting'
import Tidal from '@/page/Tidal'

const AllRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: <Home /> },
        { path: '/setting', element: <Setting /> },
        { path: '/tidal', element: <Tidal /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])
  return routes
}

export default AllRoutes
