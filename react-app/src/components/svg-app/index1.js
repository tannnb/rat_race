

import React from 'react'
import _ from 'lodash'
function SvgIndex () {

  const sourcedata = [
    { time: '2023-06-21 10:00:00', name: '一号店表', value: 200 },
    { time: '2023-06-21 10:00:00', name: '二号店表', value: 40 },
    { time: '2023-06-22 10:00:00', name: '一号店表', value: 20 },
    { time: '2023-06-22 10:00:00', name: '二号店表', value: 70 },
  ]

  const theader = [...new Set(sourcedata.map(item => item.name))]
  const tProps = []
  const tBody = []
  const timemap = [...new Set(sourcedata.map(item => item.time))]

  const result = []
  timemap.forEach((time, timeIndex) => {
    result[timeIndex] = []
    sourcedata.forEach((childItem, childIndex) => {
      if (time === childItem.time) {
        result[timeIndex].push(childItem)
      }
    })
  })
 
  result.forEach((item,index) => {
    const value = {}
    item.forEach((subItem,index) => {
      value.time = subItem.time
      theader.forEach((childItem,childIndex) => {
        if(childItem === subItem.name) {
          value[`value${childIndex}`] = subItem.value
        }
      })
    })
    tBody.push(value)
  })
  const first = _.head(tBody)
  for(let key in first) {
    tProps.push(key)
  }

  theader.unshift('时间')
  


  return (
    <>
      <svg width="400" height="400">
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'red' }}></stop>
            <stop offset="100%" style={{ stopColor: '#0099cc' }}></stop>
          </linearGradient>
        </defs>
        {/* <line x1="10"  y1="10" x2="50" y2="90" stroke="red" /> */}
        <rect x="10" y="10" width="200" height="100" fill="url(#linear)"></rect>
      </svg>


    </>
  )
}
export default SvgIndex;