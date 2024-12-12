import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import HomeIcon from '@/assets/img/home.svg'
import SettingIcon from '@/assets/img/setting.svg'
import TidalIcon from '@/assets/img/tidal.svg'

const SideBar = () => {
  return (
    <div className="side-bar">
      <ul>
        <li>
          <Link to="/">
            <img src={HomeIcon} alt="首頁" />
          </Link>
        </li>
        <li>
          <Link to="/setting">
            <img src={SettingIcon} alt="設定" />
          </Link>
        </li>
        <li>
          <Link to="/tidal">
            <img src={TidalIcon} alt="潮汐" />
          </Link>
        </li>
      </ul>
    </div>
  )
}

const Layout = () => {
  return (
    <>
      <SideBar />
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
