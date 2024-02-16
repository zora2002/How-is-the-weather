import React from 'react'

import store from '@/store'
import '@/assets/style/Setting.scss'
import cityDistricts from '@/config/cityDistricts'
import { wgs84ToCityDistrict } from '@/config/apiList'

const Setting = () => {
  const cityList = cityDistricts.cities
  const [districtList, setDistrictList] = React.useState([])
  const [manualCity, setManualCity] = React.useState('')
  const [manualDistrict, setManualDistrict] = React.useState('')
  const city = store.getState().location.searchCity
  const district = store.getState().location.searchDistrict

  const manualCityHandler = (event) => {
    setManualCity(event.target.value)
    const districtIndex = cityDistricts.cities.findIndex((i) => i === event.target.value)
    setDistrictList(event.target.value ? cityDistricts.districts[districtIndex] : [])
    manualDistrictHandler('')
  }
  const manualDistrictHandler = (event) => {
    setManualDistrict(event === '' ? event : event.target.value)
  }
  const manualUpdateLocation = () => {
    if (!manualCity) {
      console.log('請選縣市')
    } else if (!manualDistrict) {
      console.log('請選鄉鎮市區')
    } else {
      setLocalStorageLocation(manualCity, manualDistrict)
      store.dispatch({
        type: 'UPDATE_LOCATION',
        data: {
          searchCity: manualCity,
          searchDistrict: manualDistrict,
        },
      })
    }
  }

  const setLocalStorageLocation = (city, district) => {
    localStorage.city = city
    localStorage.district = district
  }

  const autoUpdateLocation = () => {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
      return
    }
    const success = (position) => {
      setManualCity('')
      manualDistrictHandler('')
      //WGS-84
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      wgs84ToCityDistrict(longitude, latitude)
        .then((response) => {
          setLocalStorageLocation(response.data.ctyName, response.data.townName)
          store.dispatch({
            type: 'UPDATE_LOCATION',
            data: {
              searchCity: response.data.ctyName,
              searchDistrict: response.data.townName,
            },
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
    const error = () => {
      console.log('定位失敗')
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  const opacity = store.getState().dashboard.backgroundColorOpacity
  const [dashboardBackgroundColorOpacity, setDashboardBackgroundColorOpacity] = React.useState(opacity)

  const updateDashBoard = (event) => {
    store.dispatch({
      type: 'UPDATE_DASHBOARD',
      data: {
        backgroundColorOpacity: event.target.value,
      },
    })
    setDashboardBackgroundColorOpacity(event.target.value)
  }

  return (
    <div className="setting-bg">
      <div className="setting">
        <ul>
          <li className="now-location">
            <div className="item">現在位置</div>
            <div className="content">
              {city} {district}
            </div>
          </li>
          <li className="manual">
            <div className="item">手動選擇</div>
            <div className="content">
              <select className="city" value={manualCity} onChange={manualCityHandler}>
                <option value="">縣市</option>
                {cityList.map((i) => {
                  return (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  )
                })}
              </select>
              <select className="district" value={manualDistrict} onChange={manualDistrictHandler}>
                <option value="">鄉鎮市區</option>
                {districtList.map((i) => {
                  return (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  )
                })}
              </select>
              <button onClick={manualUpdateLocation}>更新位置</button>
            </div>
          </li>
          <li className="auto">
            <div className="item">自動選擇</div>
            <div className="content">
              <button onClick={autoUpdateLocation}>自動取得位置</button>
            </div>
          </li>
        </ul>
        <span className="setting-divider"></span>
        <ul>
          <li>
            <div className="item">透明度</div>
            <div className="content">
              <input
                type="range"
                min="0"
                max="100"
                value={dashboardBackgroundColorOpacity}
                onChange={updateDashBoard}
              />
              {opacity}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Setting
