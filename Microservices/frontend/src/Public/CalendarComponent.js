import React from 'react'
import { Calendar } from '@nivo/calendar'

function CalendarComponent({ width, height, data, year, colors }) {
  const margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  }

  return (
      <Calendar
          width={width}
          height={height}
          margin={margin}
          data={data}
          from={`${year}-01-01`}
          to={`${year}-12-31`}
          colors={colors}
          emptyColor='#eee'
          monthBorderWidth={0}
          dayBorderWidth={3}
          dayBorderColor='#fff'
      />
  )
}

export default CalendarComponent
