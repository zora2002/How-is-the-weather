// NOTE 三十六小時天氣預報
// NOTE F-C0032-001
export interface Weather36HourEvery12HourRequestData {
  url: string,
  location: string,
}

// NOTE 臺灣各縣市鄉鎮未來3天(72小時)逐3小時天氣預報
// NOTE F-D0047-
export interface Weather3DayEvery3HourRequestData extends Weather36HourEvery12HourRequestData { }

// NOTE 臺灣各縣市鄉鎮未來1週逐12小時天氣預報
// NOTE F-D0047-
export interface Weather7DayEvery12HourRequestData extends Weather36HourEvery12HourRequestData { }

// NOTE 全臺各縣市每天的日出、日沒及太陽過中天等時刻資料-含有日出日沒時之方位及過中天時之仰角資料
// NOTE A-B0062-001
export interface SunRequestData {
  url: string,
  location: string,
  sort: string,
  timeFrom: string,
  timeTo: string,
}

// NOTE 全臺各縣市每天的月出、月沒及月球過中天等時刻資料-含有月出月沒時之方位及過中天時之仰角資料
// NOTE A-B0063-001
export interface MoonRequestData extends SunRequestData {
}

// NOTE 潮汐預報-未來 1 個月潮汐預報
// NOTE F-A0021-001
export interface Tidal1MonthRequestData {
  url: string
  location: string
  sort: string
}
