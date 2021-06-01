import './Questions.css'
import { useState, useEffect } from 'react'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Question from './Question';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

const axios = require('axios')
const url = 'http://saas-15.ddns.net:3002/browse/questions?pagesize=10&pagenr=1'

function Questions() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    axios.get(url)
        .then(response => {
          setQuestions(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [])

  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='questions-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <Card.Body className='w-100' style={{ maxWidth: '950px' }}>
                <ListGroup variant='flush'>
                  {questions.map(question => (
                      <ListGroup.Item  key={question.id}>
                        <Question
                            title={question.title}
                            summary={question.questContent}
                            keywords={question.keywords}
                            askedOn={question.askedOn}
                            askedBy={question.user?.displayName}
                            answerCount={question.ansCount}
                        />
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Container>
        </Container>
        <Footer />
      </div>
  )
}

export default Questions
