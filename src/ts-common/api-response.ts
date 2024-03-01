export interface ResponseStructure<T> {
  success: string
  result: {
    resource_id: string
    fields: {
      id: string
      type: string
    };
  }
  records: T
}

// NOTE 三十六小時天氣預報
// NOTE F-C0032-001
export interface Weather36HourEvery12HourResponseData {
  datasetDescription: string
  location: {
    locationName: string
    weatherElement: {
      elementName: string
      time: {
        startTime: string
        endTime: string
        parameter: {
          parameterName: string
          parameterValue?: string
          parameterUnit?: string
        }
      }[]
    }[]
  }[]
}



// NOTE 臺灣各縣市鄉鎮未來3天(72小時)逐3小時天氣預報
// NOTE F-D0047-
export interface Weather3DayEvery3HourResponseData {
  locations: {
    datasetDescription: string
    locationsName: string
    dataid: string
    location: {
      locationName: string
      geocode: string
      lat: string
      lon: string
      weatherElement: {
        elementName: string
        description: string
        time: {
          startTime?: string
          endTime?: string
          dataTime?: string
          elementValue: {
            value: string
            measures: string
          }[]
        }[]
      }[]
    }[]
  }[]
}

// NOTE 臺灣各縣市鄉鎮未來1週逐12小時天氣預報
// NOTE F-D0047-
export interface Weather7DayEvery12HourResponseData extends Weather3DayEvery3HourResponseData { }

// NOTE 全臺各縣市每天的日出、日沒及太陽過中天等時刻資料-含有日出日沒時之方位及過中天時之仰角資料
// NOTE A-B0062-001
export interface SunResponseData {
  dataid: 'A-B0062-001'
  note: string
  locations: {
    location: {
      time: {
        Date: string
        BeginCivilTwilightTime: string
        SunRiseTime: string
        SunRiseAZ: string
        SunTransitTime: string
        SunTransitAlt: string
        SunSetTime: string
        SunSetAZ: string
        EndCivilTwilightTime: string
      }[]
      CountyName: string
    }[]
  }
}

// NOTE 全臺各縣市每天的月出、月沒及月球過中天等時刻資料-含有月出月沒時之方位及過中天時之仰角資料
// NOTE A-B0063-001
export interface MoonResponseData {
  dataid: 'A-B0063-001'
  note: string
  locations: {
    location: {
      time: {
        Date: string
        MoonRiseTime: string
        MoonRiseAZ: string
        MoonTransitTime: string
        MoonTransitAlt: string
        MoonSetTime: string
        MoonSetAZ: string
      }[]
      CountyName: string
    }[]
  }
}

// NOTE 潮汐預報-未來 1 個月潮汐預報
// NOTE F-A0021-001
export interface Tidal1MonthResponseData {
  datais: 'F-A0021-001'
  note: string
  TideForecasts: {
    Location: {
      LocationId: string
      LocationName: string
      Latitude: number
      Longitude: number
      TimePeriods: {
        Daily: {
          Date: string
          LunarDate: string
          TideRange: string
          Time: {
            DateTime: string
            Tide: string
            TideHeights: {
              AboveTWVD: string
              AboveLocalMSL: number
              AboveChartDatum: number
            }
          }[]
        }[]
      }
    }
  }[]
}
