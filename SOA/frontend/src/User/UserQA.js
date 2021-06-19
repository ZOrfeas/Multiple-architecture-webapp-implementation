import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CalendarComponent from '../Public/CalendarComponent'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

const axios = require('axios')
const url = process.env.REACT_APP_ACCOUNT_URL

function UserQA({ userId, q, data }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [calendarData, setCalendarData] = useState([])
  const [totalData, setTotalData] = useState(0)

  useEffect(() => {
    const service = q ? 'questionCountByYear' : 'answerCountByYear'
    axios.get(`${url}/${service}?id=${userId}&year=${year}`)
        .then(response => {
          const { data, total } = formatData(response.data)
          setCalendarData(data)
          setTotalData(total)
        })
        .catch(error => {
          console.log(error)
        })
  }, [year])

  const formatData = obj => {
    const data = []
    let total = 0
    for (const [key, value] of Object.entries(obj)) {
      data.push({ day: key, value: parseInt(value) })
      total += parseInt(value)
    }
    return { data, total }
  }

  const formatDate = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  const getYears = start => {
    const years = []
    for (let i = new Date().getFullYear(); i >= start; --i) {
      years.push(<option key={i}>{i}</option>)
    }
    return years
  }

  const colorsQ = [
    'rgba(242,114,12,0.4)',
    'rgba(242,114,12,0.6)',
    'rgba(242,114,12,0.8)',
    'rgba(242,114,12)'
  ]
  const colorsA = [
    'rgba(43,74,161,0.4)',
    'rgba(43,74,161,0.6)',
    'rgba(43,74,161,0.8)',
    'rgba(43,74,161)'
  ]

  return (
      <div className='tab-wrapper py-5'>
        <div>
          <InputGroup className='ml-auto mb-3 px-0' style={{ width: '180px' }}>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <span className='material-icons-sharp date-icon'>date_range</span>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                as='select'
                onChange={e => setYear(parseInt(e.target.value))}
                custom
            >
              {getYears(q
                  ? parseInt(data[data.length-1]?.askedOn?.slice(0,4))
                  : parseInt(data[data.length-1]?.answeredOn?.slice(0,4)))}
            </Form.Control>
          </InputGroup>

          <h5>{q ? 'Questions ' : 'Answers '} <span className='small'>({totalData})</span></h5>
          <Card className='calendar mb-3'>
            <CalendarComponent
                width={820}
                height={300}
                data={calendarData}
                year={year}
                colors={q ? colorsQ : colorsA}
            />
          </Card>

          <div className='mt-5'>
            <div className='border-bttm pb-3'>
              {data.length}{q ? ' question' : ' answer'}{data.length !== 1 && 's'}
            </div>
            <ListGroup variant='flush'>
              {data.map(item => (
                  <ListGroup.Item className='d-flex align-items-center py-3' key={q ? item.id : item.question_id}>
                    <span className='question-title'><Link to={`/questions/${q ? item.id : item.question_id}`}>{item.title}</Link></span>
                    <span className='date-user text-muted ml-auto px-0'>{formatDate(q ? item.askedOn : item.answeredOn)}</span>
                  </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
  )
}

export default UserQA
