import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'
import SideBar from './components/SideBar'
import Home from './page/Home'
import Setting from './page/Setting'
import { changeStandardTime, getTimePeriod } from './function/time'

const searchCity = '臺中市'
// const searchDistrict = '西屯區'

const App = () => {
  const [time, setTime] = React.useState(new Date())
  const [timePeriod, setTimePeriod] = React.useState('')

  React.useEffect(() => {
    const getNowTime = setInterval(() => {
      setTime(new Date())
    }, 60 * 1000)

    const calculateTimePeriod = () => {
      setTimePeriod(getTimePeriod(searchCity, changeStandardTime(time, 'hh:mm')))
    }

    calculateTimePeriod()

    return () => {
      clearInterval(getNowTime)
    }
  }, [time])
  return (
    <Router>
      <div className={`App time-period ${timePeriod}`}>
        <SideBar />
        <Switch>
          <Route exact path="/">
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
