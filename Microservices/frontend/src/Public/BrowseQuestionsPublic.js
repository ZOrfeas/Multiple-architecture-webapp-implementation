import '../Questions/Questions.css'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrowseQuestionItem from '../Questions/BrowseQuestionItem'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSING_URL

function BrowseQuestionsPublic() {
  const [questions, setQuestions] = useState([])

  // get public questions
  useEffect(() => {
    axios.get(`${url}/publicQuestions`)
        .then(response => setQuestions(response.data))
        .catch(error => console.log(error))
  }, [])

  return (
      <Container className='questions-content py-5'>
        <Card className='d-flex align-items-center justify-content-center'>
          <div className='w-100' style={{ maxWidth: '950px' }}>
            <Card.Header className='py-4'>
              <div className='text-center px-0'>
                <h5>
                  You are viewing the {questions.length} most recent questions
                </h5>
                <p className='mb-0'>
                  To view unlimited questions, filter them by keywords and post your answers,
                </p>
                <p className='mb-5'>
                  <Link to='/login'>Log in</Link> or <Link to='/signup'>Sign up</Link>.
                </p>
              </div>

              <h5 className='font-weight-bold mb-3'>
                Most recent questions
              </h5>

              <Row className='align-items-end mx-0'>
                <Col className='px-0'>
                  {questions.length} question{questions.length !== 1 && 's'}
                </Col>
                <Col className='px-0 text-right'>
                  <Button className='qa-btn' href='/questions/ask'>Ask a question</Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className='pb-4'>
              <ListGroup className='questions-browse-list'>
                {questions.map(question => (
                    <Card className='mb-2' key={question.id}>
                      <ListGroup.Item className='border-0'>
                        <BrowseQuestionItem
                            id={question.id}
                            title={question.title}
                            summary={question.questContent}
                            keywords={question.keywords}
                            askedOn={question.createdAt}
                            askedBy={question.user?.displayName}
                            answerCount={question.ansCount}
                        />
                      </ListGroup.Item>
                    </Card>
                ))}
              </ListGroup>
            </Card.Body>
          </div>
        </Card>
      </Container>
  )
}

export default BrowseQuestionsPublic
