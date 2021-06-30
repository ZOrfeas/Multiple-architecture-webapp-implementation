// format date string to 'MM, DD YYYY'
export const formatDate = date => {
  const dateObj = new Date(date.split('.')[0])
  const [, month, dayNum, year] = dateObj.toDateString().split(' ')
  return `${month}, ${dayNum} ${year}`
}

// format name to be used in url
export const formatName = name => name.split(' ').join('-')

// format data for Calendar Component
export const formatData = obj => {
  const data = []
  let total = 0
  for (const [key, value] of Object.entries(obj)) {
    data.push({ day: key, value: parseInt(value) })
    total += parseInt(value)
  }
  return { data, total }
}

// get years for dropdown selector
export const getYears = start => {
  const years = []
  for (let i = new Date().getFullYear(); i >= start; --i) {
    years.push(<option key={i}>{i}</option>)
  }
  return years
}
