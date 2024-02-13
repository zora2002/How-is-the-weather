import React from 'react'
import { Link } from 'react-router-dom'
import '../style/SideBar.scss'

const SideBar = () => {
  return (
    <div className="side-bar">
      <ul>
        <li>
          <Link to="/">
            <img src={require('../img/home.svg')} alt="首頁" />
          </Link>
        </li>
        <li>
          <Link to="/setting">
            <img src={require('../img/setting.svg')} alt="設定" />
          </Link>
        </li>
        <li>
          <Link to="/tidal">
            <img src={require('../img/tidal.svg')} alt="潮汐" />
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar
