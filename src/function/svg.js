import React from 'react'

export function setting2SVG(tempList, xlineNum, xEveryWidth, yTotalHeight) {
  const originTempList = { ...tempList }
  let mixlist = tempList.day.concat(tempList.night)

  // X軸間距
  let xline = []
  for (let i = 0; i < xlineNum; i++) {
    xline.push(i * xEveryWidth)
  }
  // console.log(xline)

  // 氣溫列表字串轉數字，並取得各值與最大值的差
  mixlist = mixlist.map((i) => parseInt(i))

  tempList.day = tempList.day.map((i) => Math.abs(i - Math.max(...mixlist)))
  tempList.night = tempList.night.map((i) => Math.abs(i - Math.max(...mixlist)))

  mixlist = mixlist.map((i) => Math.abs(i - Math.max(...mixlist)))
  // console.log(mixlist)

  // 取得最大的差
  const diffTemp = Math.max(...mixlist) - Math.min(...mixlist)
  // console.log(diffTemp)

  // 最大的差:yTotalHeight(svg高度) => 比例套在各值，得出每個氣溫的svg高度
  tempList.day = tempList.day.map((i) => i * Math.round(yTotalHeight / diffTemp))
  tempList.night = tempList.night.map((i) => i * Math.round(yTotalHeight / diffTemp))

  let svgInfoListValue = {
    text: [],
    circle: [],
  }
  let svgPathDValue = {
    day: [],
    night: [],
  }

  for (let i = 0; i < xline.length; i++) {
    // day
    svgInfoListValue.text.push(
      <text
        key={`text-day-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList.day[i] - 10 + 10}
        fontSize="13"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList.day[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle key={`circle-day-${xline[i]}-${i}`} cx={xline[i] + 10} cy={tempList.day[i] + 10} r="3" fill="#000000" />
    )
    svgPathDValue.day += `${xline[i]},${tempList.day[i] + 10},`

    // night
    svgInfoListValue.text.push(
      <text
        key={`text-night-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList.night[i] - 10 + 10}
        fontSize="13"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList.night[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle
        key={`circle-night-${xline[i]}-${i}`}
        cx={xline[i] + 10}
        cy={tempList.night[i] + 10}
        r="3"
        fill="#000000"
      />
    )
    svgPathDValue.night += `${xline[i]},${tempList.night[i] + 10},`
  }

  return {
    svgInfoListValue: svgInfoListValue,
    svgPathDValue: svgPathDValue,
  }
}

export function settingSVG(tempList, xlineNum, xEveryWidth, yTotalHeight) {
  const originTempList = [...tempList]
  // X軸間距
  let xline = []
  for (let i = 0; i < xlineNum; i++) {
    xline.push(i * xEveryWidth)
  }
  // console.log(xline)

  // 氣溫列表字串轉數字，並取得各值與最大值的差
  tempList = tempList.map((i) => parseInt(i))
  tempList = tempList.map((i) => Math.abs(i - Math.max(...tempList)))
  // console.log(tempList)

  // 取得最大的差
  const diffTemp = Math.max(...tempList) - Math.min(...tempList)
  // console.log(diffTemp)

  // 最大的差:yTotalHeight(svg高度) => 比例套在各值，得出每個氣溫的svg高度
  tempList = tempList.map((i) => i * Math.round(yTotalHeight / diffTemp))
  // console.log(tempList)

  let svgInfoListValue = {
    text: [],
    circle: [],
  }
  let svgPathDValue = ''

  for (let i = 0; i < xline.length; i++) {
    svgInfoListValue.text.push(
      <text
        key={`text-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList[i] - 10 + 30}
        fontSize="14"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle key={`circle-${xline[i]}-${i}`} cx={xline[i] + 10} cy={tempList[i] + 30} r="3" fill="#000000" />
    )
    svgPathDValue += `${xline[i]},${tempList[i] + 30},`
  }
  // console.log(svgInfoListValue)

  return {
    svgInfoListValue: svgInfoListValue,
    svgPathDValue: svgPathDValue,
  }
}
