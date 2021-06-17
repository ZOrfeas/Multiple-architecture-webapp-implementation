import './QAPerDay.css'
import { useState, useEffect } from 'react'
import CalendarComponent from './CalendarComponent'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Col from 'react-bootstrap/Col'

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
          .then(response => formatData(response.data, setQuestionData, setTotalQuestions))
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

  const getYears = () => {
    const years = []
    for (let i = new Date().getFullYear(); i >= 2015; --i) {
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
            <InputGroup as={Col} xs={6} md={3} lg={2} className='ml-auto px-0'>
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
                {getYears()}
              </Form.Control>
            </InputGroup>
          </Card.Header>
          <Card.Body>
            <div>
              <h5>Questions ({totalQuestions})</h5>
              <Card className='calendar mb-3'>
                <CalendarComponent
                    data={questionData}
                    year={year}
                    colors={colorsQ}
                />
              </Card>
            </div>
            <div>
              <h5>Answers ({totalAnswers})</h5>
              <Card className='calendar mb-3'>
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
