import { useState } from 'react'
import axios from 'axios'

import useApp from '@/contexts/app-context-use'
import '@/assets/style/Setting.scss'
import cityDistricts from '@/config/cityDistricts'

/**
 * 座標轉行政區資料
 * @param  {String} longitude 經度
 * @param  {String} latitude 緯度
 */
const wgs84ToCityDistrict = (longitude: string, latitude: string) => {
  // https://data.moi.gov.tw/MoiOD/Data/DataDetail.aspx?oid=CA6D10B1-C474-41DB-8B53-28E7E4E18977
  return axios.get(`https://api.nlsc.gov.tw/other/TownVillagePointQuery/${longitude}/${latitude}/4326`)
}

const Setting = () => {
  const { location, dispatch, dashboard } = useApp()
  const cityList = cityDistricts.cities
  const [districtList, setDistrictList] = useState([])
  const [manualCity, setManualCity] = useState('')
  const [manualDistrict, setManualDistrict] = useState('')
  const [opacity, setOpacity] = useState(dashboard.backgroundColorOpacity)

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
      return
    }
    if (!manualDistrict) {
      console.log('請選鄉鎮市區')
      return
    }
    dispatch({
      type: 'setLocation',
      payload: {
        searchCity: manualCity,
        searchDistrict: manualDistrict,
      },
    })
  }

  const autoUpdateLocation = () => {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
      return
    }
    const success = async (position) => {
      setManualCity('')
      manualDistrictHandler('')
      //WGS-84
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      try {
        const response = await wgs84ToCityDistrict(longitude, latitude)
        dispatch({
          type: 'setLocation',
          payload: {
            searchCity: response.data.ctyName,
            searchDistrict: response.data.townName,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
    const error = () => {
      console.log('定位失敗')
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  const updateDashBoard = (event) => {
    dispatch({
      type: 'setBackgroundColorOpacity',
      payload: event.target.value,
    })
    setOpacity(event.target.value)
  }

  return (
    <div className="setting-bg">
      <div className="setting">
        <ul>
          <li className="now-location">
            <div className="item">現在位置</div>
            <div className="content">
              {location.searchCity} {location.searchDistrict}
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
              <input type="range" min="0" max="100" value={opacity} onChange={updateDashBoard} />
              {dashboard.backgroundColorOpacity}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Setting
