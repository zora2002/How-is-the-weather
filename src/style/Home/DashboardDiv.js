import styled from 'styled-components'

const DashboardDiv = styled.div`
  background-color: rgba(255, 255, 255, ${(props) => props.backgroundColorOpacity / 100});
`

export default DashboardDiv
