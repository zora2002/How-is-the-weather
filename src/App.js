import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'
import SideBar from './components/SideBar'
import Wallpaper from './components/Wallpaper'
import Home from './page/Home'
import Setting from './page/Setting'
import { connect } from 'react-redux'

const App = ({ location }) => {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const getNowTime = setInterval(() => {
      setTime(new Date())
    }, 60 * 1000)

    return () => {
      clearInterval(getNowTime)
    }
  }, [time, location])
  return (
    <Router>
      <div className="App">
        <SideBar />
        <Switch>
          <Route exact path="/">
            <Wallpaper time={time} location={location} />
            <Home time={time} location={location} />
          </Route>
          <Route exact path="/setting">
            <Setting />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.location,
  }
}

// export default App
export default connect(mapStateToProps)(App)
