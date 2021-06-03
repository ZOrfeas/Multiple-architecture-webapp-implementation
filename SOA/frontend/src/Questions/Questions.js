import './Questions.css'
import React, { useState, useEffect } from 'react'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Question from './Question';
import PaginationComponent from '../Pagination/Pagination'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from "react-bootstrap/Button";

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function Questions() {
  const [questions, setQuestions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    axios.get(`${url}/count/questions`)
        .then(response => {
          setTotalQuestions(response.data)
        })
        .catch(error => {
          console.log(error)
        })

    axios.get(`${url}/questions?pagesize=${pageSize}&pagenr=${currentPage}`)
        .then(response => {
          setQuestions(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [currentPage])

  console.log(questions)
  console.log(totalQuestions)

  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='questions-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <Card.Header className='w-100 py-4' style={{ maxWidth: '902px' }}>
                <div className='text-center px-0'>
                  <h5>
                    <span className='material-icons-outlined mr-2 hand-icon'>waving_hand</span>
                    Want to contribute to <span className='ama-logo'>AskMeAnything</span>?
                  </h5>
                  <p className='mb-4'>Ask a question or help others answer theirs</p>
                </div>
                <Row className='align-items-center mx-0 mb-2'>
                  <Col className='px-0'>
                    <h5 className='font-weight-bold mb-0'>All questions</h5>
                  </Col>
                  <Col className='px-0 text-right'>
                    <Button variant='success'>Ask question</Button>
                  </Col>
                </Row>
                <div className='px-0'>{totalQuestions} questions</div>
              </Card.Header>
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
                <PaginationComponent
                    totalItems={totalQuestions}
                    pageSize={pageSize}
                    pageRange={5}
                    pageState={[currentPage, setCurrentPage]}
                />
              </Card.Body>
            </Card>
          </Container>
        </Container>
        <Footer />
      </div>
  )
}

export default Questions
