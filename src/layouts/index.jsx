import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import '../style/SideBar.scss'

import HomeIcon from '../img/home.svg'
import SettingIcon from '../img/setting.svg'
import TidalIcon from '../img/tidal.svg'

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
      <Outlet />
    </>
  )
}

export default Layout
