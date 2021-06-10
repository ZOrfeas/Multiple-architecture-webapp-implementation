import './QAPerDay.css'
import { useState, useEffect } from 'react'
import CalendarComponent from './CalendarComponent'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function QAPerDay() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [questionData, setQuestionData] = useState([])
  const [totalQuestions, setTotalQestions] = useState(0)
  const [answerData, setAnswerData] = useState([])
  const [totalAnswers, setTotalAnswers] = useState(0)

  // get question and answer by year data
  useEffect(() => {
    try {
      axios.get(`${url}/questionCountByYear?year=${year}`)
          .then(response => formatData(response.data, setQuestionData, setTotalQestions))
      axios.get(`${url}/answerCountByYear?year=${year}`)
          .then(response => formatData(response.data, setAnswerData, setTotalAnswers))
    } catch(error) {
      console.log(error)
    }
  }, [year])

  const formatData = (obj, f1, f2) => {
    const data = []
    let sum = 0
    for (const [key, value] of Object.entries(obj)) {
      data.push({ day: key, value: parseInt(value) })
      sum += parseInt(value)
    }
    f1(data)
    f2(sum)
  }

  const years = () => {
    const years = []
    for (let i = new Date().getFullYear(); i >= 2015; --i) {
      years.push(<option key={i}>{i}</option>)
    }
    return years
  }

  const colorsQ = [
    'rgba(242,114,12,0.4)',
    'rgba(242,114,12,0.6)',
    'rgba(242,114,12,0.7)',
    'rgba(242,114,12,0.8)',
    'rgba(242,114,12)'
  ]
  const colorsA = [
    'rgba(43,74,161,0.4)',
    'rgba(43,74,161,0.6)',
    'rgba(43,74,161,0.7)',
    'rgba(43,74,161,0.8)',
    'rgba(43,74,161)'
  ]

  return (
      <Container className='calendar-content py-5'>
        <Card>
          <Card.Header className='py-4'>
            <InputGroup as={Col} xs={6} md={3} className='ml-auto px-0'>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <i className='material-icons-sharp date-icon'>date_range</i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                  as='select'
                  onChange={e => setYear(e.target.value)}
                  custom
              >
                {years()}
              </Form.Control>
            </InputGroup>
          </Card.Header>
          <Card.Body>
            <div>
              <p className='mb-1'>
                {totalQuestions} question{totalQuestions !== 1 && 's'} in {year == new Date().getFullYear() ? ' the last year' : year}
              </p>
              <Card className='calendar align-items-center mb-3'>
                <CalendarComponent
                    data={questionData}
                    year={year}
                    colors={colorsQ}
                />
              </Card>
            </div>
            <div>
              <p className='mb-1'>
                {totalAnswers} answer{totalAnswers !== 1 && 's'} in {year == new Date().getFullYear() ? ' the last year' : year}
              </p>
              <Card className='calendar align-items-center mb-3'>
                <CalendarComponent
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
