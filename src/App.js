import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'
import SideBar from './components/SideBar'
import Wallpaper from './components/Wallpaper'
import Home from './page/Home'
import Setting from './page/Setting'

const App = () => {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const getNowTime = setInterval(() => {
      setTime(new Date())
    }, 60 * 1000)

    return () => {
      clearInterval(getNowTime)
    }
  }, [time])
  return (
    <Router>
      <div className="App">
        <SideBar />
        <Switch>
          <Route exact path="/">
            <Wallpaper time={time} />
            <Home time={time} />
          </Route>
          <Route exact path="/setting">
            <Setting />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
