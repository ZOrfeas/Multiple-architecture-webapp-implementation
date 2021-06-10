import { Calendar } from '@nivo/calendar'

function CalendarComponent({ data, year, colors }) {
  const margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  }

  return (
      <Calendar
          data={data}
          from={`${year}-01-01`}
          to={`${year}-12-31`}
          width={1200}
          height={300}
          margin={margin}
          colors={colors}
          emptyColor='#ddd'
          monthBorderWidth={0}
          dayBorderWidth={3}
          dayBorderColor='#fff'
      />
  )
}

export default CalendarComponent
