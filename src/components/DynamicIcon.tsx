import { useState } from 'react'

const DynamicIcon = ({ icon, hour, isDay }: { icon: string; hour?: number; isDay?: boolean }) => {
  const [image, setImage] = useState(null)

  isDay = isDay || (hour > 5 && hour < 18)

  import(`../assets/img/icon/${isDay ? 'day' : 'night'}/${parseInt(icon)}.svg`)
    .then((image) => {
      setImage(image.default)
    })
    .catch((error) => {
      console.error('Error loading image:', error)
    })

  return image ? <img src={image} alt="Dynamic Image" /> : <div>...</div>
}

export default DynamicIcon
