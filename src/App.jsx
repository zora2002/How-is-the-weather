import React from 'react'
import '@/App.scss'
import AllRoutes from '@/routes'

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
    <div className="App">
      <AllRoutes time={time} location={location} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.location,
  }
}

// export default App
export default connect(mapStateToProps)(App)
