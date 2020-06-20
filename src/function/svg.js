import React from 'react'

export function settingSVG(originTempList, tempList, xlineNum, xEveryWidth, yTotalHeight) {
  // originTempList = ['25', '30', '37', '25', '32', '20', '28', '34', '30', '28']
  // tempList = ['25', '30', '37', '25', '32', '20', '28', '34', '30', '28']

  // X軸間距
  let xline = []
  for (let i = 0; i < xlineNum; i++) {
    xline.push(i * xEveryWidth)
  }
  // console.log(xline)

  // 氣溫列表字串轉數字，並取得各值與最大值的差
  tempList.map((i) => parseInt(i))
  tempList.map((i, index) => (tempList[index] = Math.abs(i - Math.max(...tempList))))
  // console.log(tempList)

  // 取得最大的差
  const diffTemp = Math.max(...tempList) - Math.min(...tempList)
  // console.log(diffTemp)

  // 最大的差:yTotalHeight(svg高度) => 比例套在各值，得出每個氣溫的svg高度
  tempList.map((i, index) => (tempList[index] = i * Math.round(yTotalHeight / diffTemp)))
  // console.log(tempList)

  let svgInfoListValue = []
  let svgPathDValue = ''

  for (let i = 0; i < xline.length; i++) {
    svgInfoListValue.push(
      <>
        <text x={xline[i] + 10 + 10} y={tempList[i] - 10 + 30} fontSize="12" textAnchor="end" fill="#707070">
          {originTempList[i]}
        </text>
        <circle cx={xline[i] + 10} cy={tempList[i] + 30} r="2" fill="#707070" />
      </>
    )
    svgPathDValue += `${xline[i]},${tempList[i] + 30},`
  }
  // console.log(svgInfoListValue)

  return {
    svgInfoListValue: svgInfoListValue,
    svgPathDValue: svgPathDValue,
  }
}
