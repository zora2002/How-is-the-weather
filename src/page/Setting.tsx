import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast, ToastOptions, Slide } from 'react-toastify'

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

const toastOption: Record<'type' | 'status', ToastOptions> = {
  type: {
    position: 'bottom-left',
    theme: 'light',
    transition: Slide,
    hideProgressBar: true,
  },
  status: {
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
  },
}

const Setting = () => {
  const { location, dispatch, dashboard } = useApp()
  const cityList = cityDistricts.cities
  const [districtList, setDistrictList] = useState([])
  const [manualCity, setManualCity] = useState('')
  const [manualDistrict, setManualDistrict] = useState('')
  const [opacity, setOpacity] = useState(dashboard.backgroundColorOpacity)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const manualCityHandler = (city: string) => {
    setManualCity(city)
    setManualDistrict('')
    const districtIndex = cityDistricts.cities.findIndex((i) => i === city)
    setDistrictList(city ? cityDistricts.districts[districtIndex] : [])
  }

  const manualUpdateLocation = () => {
    if (!manualCity) {
      toast('請先選縣市', {
        ...toastOption.type,
        ...toastOption.status,
        type: 'warning',
      })
      return
    }
    if (!manualDistrict) {
      toast('請選鄉鎮市區', {
        ...toastOption.type,
        ...toastOption.status,
        type: 'warning',
      })
      return
    }
    dispatch({
      type: 'setLocation',
      payload: {
        searchCity: manualCity,
        searchDistrict: manualDistrict,
      },
    })
    toast('位置已更新', {
      ...toastOption.type,
      ...toastOption.status,
      type: 'success',
    })
  }

  const autoUpdateLocation = () => {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation
    if (!navigator.geolocation) {
      toast('Oops! Geolocation is not supported by your browser 😥', {
        ...toastOption.type,
        ...toastOption.status,
        type: 'error',
      })
      return
    }
    const toastId = toast.loading('Please wait...', { ...toastOption.type })
    const success = async (position) => {
      setManualCity('')
      setManualDistrict('')
      setDistrictList([])
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
        toast.update(toastId, {
          ...toastOption.type,
          ...toastOption.status,
          type: 'success',
          render: '位置已更新',
          isLoading: false,
        })
        setIsLoading(false)
      } catch (error) {
        throw new Error(error)
      }
    }
    const error = () => {
      toast.update(toastId, {
        ...toastOption.type,
        ...toastOption.status,
        type: 'error',
        render: '自動取得位置失敗 😥',
        isLoading: false,
      })
      setIsLoading(false)
    }
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(success, error, { timeout: 10 * 1000 })
  }

  const updateDashBoard = (event) => {
    dispatch({
      type: 'setBackgroundColorOpacity',
      payload: event.target.value,
    })
    setOpacity(event.target.value)
  }

  return (
    <>
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
                <select
                  className="city"
                  value={manualCity}
                  onChange={(event) => {
                    manualCityHandler(event.target.value)
                  }}
                >
                  <option value="">縣市</option>
                  {cityList.map((i) => {
                    return (
                      <option value={i} key={i}>
                        {i}
                      </option>
                    )
                  })}
                </select>
                <select
                  className="district"
                  value={manualDistrict}
                  onChange={(event) => {
                    setManualDistrict(event.target.value)
                  }}
                >
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
                <button onClick={autoUpdateLocation} disabled={isLoading}>
                  {isLoading ? 'Please wait...' : '自動取得位置'}
                </button>
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
      <ToastContainer />
    </>
  )
}

export default Setting
