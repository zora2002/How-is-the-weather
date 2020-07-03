import React from 'react'
import store from '../store'
import '../style/Setting.scss'
import cityDistricts from '../config/cityDistricts'

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
    districtHandler('')
  }
  const districtHandler = (event) => {
    setManualDistrict(event === '' ? event : event.target.value)
  }
  const manualUpdateLocation = () => {
    if (!manualCity) {
      console.log('請選縣市')
    } else if (!manualDistrict) {
      console.log('請選鄉鎮市區')
    } else {
      localStorage.city = manualCity
      localStorage.district = manualDistrict
      store.dispatch({
        type: 'UPDATE_LOCATION',
        data: {
          searchCity: manualCity,
          searchDistrict: manualDistrict,
        },
      })
    }
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
              <select className="district" value={manualDistrict} onChange={districtHandler}>
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
        </ul>
      </div>
    </div>
  )
}

export default Setting
