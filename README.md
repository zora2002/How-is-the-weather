# How is the weather

## Demo
![](https://github.com/zora2002/How-is-the-weather/blob/master/Demo.gif)

## 功能
1. 顯示台灣各地天氣狀況
    * 現在溫度、降雨、天氣
    * 未來每三小時天氣
    * 未來一周早晚天氣
    * 日月出沒時間
2. 不同時段(例如：dawn、morning、evening)自動切換不同背景
    * 時段的時間點設定，會依據日出日沒時間調整。冬至、夏至都可在對的日沒時間，看到對的日落背景

## 使用
> 需先上 [中央氣象局 氣象資料開放平台](https://opendata.cwb.gov.tw/index) 取得**會員授權碼**，可參考該網站的 [常見問答 Q3](https://opendata.cwb.gov.tw/faq)

1. [檔案](https://github.com/zora2002/How-is-the-weather/blob/master/.env_example) `.env_example` 改成 `.env`
2. 在 `REACT_APP_API_TOKEN=` 貼上自己的授權碼
3. 終端機執行 `npm run start`

## 注意事項
部分圖片來源：[Pexels](https://www.pexels.com/zh-tw/license/) :white_heart:

本著作係採用 [創用 CC 姓名標示-非商業性-相同方式分享 3.0 台灣 授權條款](http://creativecommons.org/licenses/by-nc-sa/3.0/tw/ )授權.

![創用 CC 授權條款](https://i.creativecommons.org/l/by-nc-sa/3.0/tw/88x31.png)