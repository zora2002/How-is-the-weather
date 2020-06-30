import React from 'react'
import '../style/SideBar.scss'

const SideBar = () => {
  return (
    <div className="side-bar">
      <ul>
        <li>
          <img src={require('../img/home.svg')} alt="首頁" />
        </li>
        <li>
          <img src={require('../img/setting.svg')} alt="設定" />
        </li>
      </ul>
    </div>
  )
}

export default SideBar
