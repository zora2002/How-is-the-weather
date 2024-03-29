# How is the weather

## Demo

![](./Demo.gif)

## 功能

1. 顯示台灣各地天氣狀況
   - 現在溫度、降雨、天氣
   - 未來每三小時天氣
   - 未來一周早晚天氣
   - 日月出沒時間
2. 不同時段(例如：dawn、morning、evening)自動切換不同背景
   - 時段的時間點設定，會依據每天的日出日沒時間調整
3. 各地區或特定場域的未來3~30天潮汐圖表

## 使用

> 需先處理跨域問題，可參考 https://www.letswrite.tw/api-cross-domain-node/ 搭配 GCP 的 Cloud Run

1. `.env_example` 改成 `.env`
2. 在 `VITE_API_BASE_URL=` 貼上自己的 server url
3. `npm install`
4. 終端機執行 `npm run start`

## 注意事項

部分圖片來源：[Pexels](https://www.pexels.com/zh-tw/license/) :white_heart:

本著作係採用 [創用 CC 姓名標示-非商業性-相同方式分享 3.0 台灣 授權條款](http://creativecommons.org/licenses/by-nc-sa/3.0/tw/)授權.

![創用 CC 授權條款](https://i.creativecommons.org/l/by-nc-sa/3.0/tw/88x31.png)
