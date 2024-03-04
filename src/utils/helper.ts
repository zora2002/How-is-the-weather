import cityDistricts from '@/config/cityDistricts'

export const getApiCode = (searchCity: string, apiDayLength: 3 | 7): string => {
  const index = cityDistricts.cities.findIndex((element) => element === searchCity)
  if (index === -1) {
    console.error(`查無此縣市： ${searchCity}`)
    return ''
  }
  const number = 4 * index + (apiDayLength === 3 ? 1 : 3)
  const code = number < 10 ? '00' + number : '0' + number
  return code
}
