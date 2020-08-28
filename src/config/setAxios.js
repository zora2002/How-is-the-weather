import axios from 'axios'

axios.defaults.timeout = 30 * 1000

axios.interceptors.request.use(
  (config) => {
    // Start API Call
    config.params && (config.params.Authorization = process.env.REACT_APP_API_TOKEN || '')
    return config
  },
  (error) => {
    console.log('Error:' + error)
    console.log('ErrorConfig: ' + error.config)
    console.log('ErrorRequest: ' + error.request)
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  (response) => {
    // Done with API call
    return response
  },
  (error) => {
    // Done with API call
    console.log('Error:' + error)
    console.log('ErrorConfig: ' + error.config)
    return Promise.reject(error)
  }
)

export default axios
