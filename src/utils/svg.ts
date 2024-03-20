export interface SvgInfoList {
  text: {
    key: string
    x: number
    y: number
    value: string
  }[]
  circle: {
    key: string
    cx: number
    cy: number
  }[]
}

export type svg1PathD = string

export interface Svg2PathD {
  day: string
  night: string
}

export const setting1SVG = (list: string[], xlineNum: number, xEveryWidth: number, yTotalHeight: number) => {
  // X軸間距
  const xline = Array.from(new Array(xlineNum), (_, i) => i * xEveryWidth)
  // 轉number
  const listInNum = list.map((i) => parseInt(i))
  // 各值與最大值的差
  const diffList = listInNum.map((i) => Math.abs(i - Math.max(...listInNum)))
  // 最大的差
  const maxDiff = Math.max(...diffList)
  // 比例 = yTotalHeight(svg高度) / 最大的差
  const heightScale = Math.round(yTotalHeight / maxDiff)
  // 每個氣溫的svg高度
  const tempListHasHeight = diffList.map((i) => i * heightScale)

  let svgInfoList: SvgInfoList = {
    text: [],
    circle: [],
  }
  let svg1PathD: string = 'M'

  const OFFSET = {
    X: 27, // 讓svg對齊ul
    Y: 30, // 讓svg離icon往下移
    TEXT: {
      X: 10, // 讓文字與圈圈置中
      Y: -10, // 讓文字離圈圈往上移
    },
  }

  xline.forEach((i, index) => {
    const x = i + OFFSET.X
    const y = tempListHasHeight[index] + OFFSET.Y

    svgInfoList.text.push({
      key: `text-${x}`,
      x: x + OFFSET.TEXT.X,
      y: y + OFFSET.TEXT.Y,
      value: list[index],
    })

    svgInfoList.circle.push({
      key: `circle-${x}`,
      cx: x,
      cy: y,
    })

    svg1PathD += `${x},${y},`
  })

  return {
    svgInfoList,
    svg1PathD,
  }
}

export const setting2SVG = (
  dayList: string[],
  nightList: string[],
  xlineNum: number,
  xEveryWidth: number,
  yTotalHeight: number
) => {
  let mixlist = dayList.concat(nightList)

  // X軸間距
  const xline = Array.from({ length: xlineNum }, (_, i) => i * xEveryWidth)
  // 轉number
  const dayInNum = dayList.map((i) => parseInt(i))
  const nightInNum = nightList.map((i) => parseInt(i))
  const mixlistInNum = mixlist.map((i) => parseInt(i))
  // 各值與最大值的差
  const diffDay = dayInNum.map((i) => Math.abs(i - Math.max(...mixlistInNum)))
  const diffNight = nightInNum.map((i) => Math.abs(i - Math.max(...mixlistInNum)))
  const diffMixlist = mixlistInNum.map((i) => Math.abs(i - Math.max(...mixlistInNum)))
  // 最大的差
  const maxDiff = Math.max(...diffMixlist)
  // 比例 = yTotalHeight(svg高度) / 最大的差
  const heightScale = Math.round(yTotalHeight / maxDiff)
  // 每個氣溫的svg高度
  const dayHasHeight = diffDay.map((i) => i * heightScale)
  const nightHasHeight = diffNight.map((i) => i * heightScale)

  let svgInfoList: SvgInfoList = {
    text: [],
    circle: [],
  }
  let svg2PathD: Svg2PathD = {
    day: 'M',
    night: 'M',
  }

  const OFFSET = {
    X: 27, // 讓svg對齊ul
    Y: 10, // 讓svg離icon往下移
    TEXT: {
      DAY: {
        X: 10, // 讓文字與圈圈置中
        Y: -10, // 讓文字離圈圈往上移
      },
      NIGHT: {
        X: 10, // 讓文字與圈圈置中
        Y: 20, // 讓文字離圈圈往下移
      },
    },
  }

  xline.forEach((i, index) => {
    const x = i + OFFSET.X
    const y = {
      day: dayHasHeight[index] + OFFSET.Y,
      night: nightHasHeight[index] + OFFSET.Y,
    }

    // day
    svgInfoList.text.push({
      key: `text-day-${i}`,
      x: x + OFFSET.TEXT.DAY.X,
      y: y.day + OFFSET.TEXT.DAY.Y,
      value: dayList[index],
    })
    svgInfoList.circle.push({
      key: `circle-day-${i}`,
      cx: x,
      cy: y.day,
    })
    svg2PathD.day += `${x},${y.day},`

    // night
    svgInfoList.text.push({
      key: `text-night-${i}`,
      x: x + OFFSET.TEXT.NIGHT.X,
      y: y.night + OFFSET.TEXT.NIGHT.Y,
      value: nightList[index],
    })
    svgInfoList.circle.push({
      key: `circle-night-${i}`,
      cx: x,
      cy: y.night,
    })
    svg2PathD.night += `${x},${y.night},`
  })

  return {
    svgInfoList,
    svg2PathD,
  }
}
