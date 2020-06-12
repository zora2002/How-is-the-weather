import React from 'react'
import './App.scss'

function App() {
  return (
    <div className="App">
      <div className="side-bar"></div>
      <div className="dashboard">
        <div className="up-area">
          <div className="today-detail"></div>
          <div className="now-info"></div>
        </div>
        <div className="down-area">
          <div className="sun-moon-time"></div>
          <div className="week-info"></div>
        </div>
      </div>
    </div>
  )
}

export default App
