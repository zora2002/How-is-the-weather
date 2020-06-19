import React from 'react'
import '../style/Home/Home.scss'
import '../style/Home/NowInfo.scss'
import TwentyFourHours from '../components/Home/TwentyFourHours'
import NowInfo from '../components/Home/NowInfo'

const Home = () => {
  return (
    <div className="dashboard">
      <div className="up-area">
        <TwentyFourHours />
        <NowInfo />
      </div>
      <div className="down-area">
        <div className="sun-moon-time"></div>
        <div className="week-info"></div>
      </div>
    </div>
  )
}

export default Home
