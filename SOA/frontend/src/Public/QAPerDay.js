import './QAPerDay.css'
import React, { useState, useEffect } from 'react'
import CalendarComponent from './CalendarComponent'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function QAPerDay() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [questionData, setQuestionData] = useState([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [answerData, setAnswerData] = useState([])
  const [totalAnswers, setTotalAnswers] = useState(0)

  // get question and answer by year data
  useEffect(() => {
    try {
      axios.get(`${url}/questionCountByYear?year=${year}`)
          .then(response => {
            const { data, total } = formatData(response.data)
            setQuestionData(data)
            setTotalQuestions(total)
          })
      axios.get(`${url}/answerCountByYear?year=${year}`)
          .then(response => {
            const { data, total } = formatData(response.data)
            setAnswerData(data)
            setTotalAnswers(total)
          })
    } catch(error) {
      console.log(error)
    }
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
      <Container className='calendar-content py-5'>
        <Card>
          <Card.Header className='py-4'>
            <h5 className='mb-0'>Calendar</h5>
          </Card.Header>

          <Card.Body>
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
                {getYears(2015)}
              </Form.Control>
            </InputGroup>

            <div>
              <h5>Questions <span className='small'>({totalQuestions})</span></h5>
              <Card className='calendar mb-3'>
                <CalendarComponent
                    width={1260}
                    height={300}
                    data={questionData}
                    year={year}
                    colors={colorsQ}
                />
              </Card>
            </div>

            <div>
              <h5>Answers <span className='small'>({totalAnswers})</span></h5>
              <Card className='calendar mb-3'>
                <CalendarComponent
                    width={1260}
                    height={300}
                    data={answerData}
                    year={year}
                    colors={colorsA}
                />
              </Card>
            </div>
          </Card.Body>
        </Card>
      </Container>
  )
}

export default QAPerDay
