import React from 'react'

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
