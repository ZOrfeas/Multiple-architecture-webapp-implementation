import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { formatDate } from '../lib'
import EditorComponent from '../Questions/EditorComponent'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const axios = require('axios')
const browse_url = process.env.REACT_APP_BROWSE_URL

function QuestionPublic() {
  const [question, setQuestion] = useState({})

  const { id } = useParams()

  // get question
  useEffect(() => {
    axios.get(`${browse_url}/publicQuestion?id=${id}`)
        .then(response => setQuestion(response.data))
        .catch(error => console.log(error))
  }, [])

  return (
      <Container className='questions-content py-5'>
        <Card className='d-flex align-items-center justify-content-center'>
          <div  className='w-100' style={{ maxWidth: '950px' }}>
            <Card.Header className='py-4'>
              <h5 className='font-weight-bold mb-0'>{question.title}</h5>
            </Card.Header>

            <Card.Body className='question'>
              <div className='question-piece mb-3' dangerouslySetInnerHTML={{__html: question.questContent}} />
              <div className='keywords mb-2'>
                {question.keywords &&
                question.keywords.map(keyword => (
                    <Badge key={keyword.id} className='keyword-badge mr-1'>{keyword.name}</Badge>
                ))}
              </div>
              <p className='date-user text-muted mb-0 px-0'>
                asked on {question.askedOn && formatDate(question.askedOn)} by {question.user?.displayName ? question.user.displayName : '[deleted]'}
              </p>
            </Card.Body>

            <Card.Body className='answers-header font-weight-bold'>
              <p className='mb-0'>
                {question.answers?.length !== undefined && `${question.answers.length} answer`}
                {question.answers?.length !== undefined && question.answers.length != 1 && 's'}
              </p>
            </Card.Body>

            <Card.Body className='answers'>
              <ListGroup className='answers-browse-list'>
                {question.answers &&
                question.answers.map(answer => (
                    <Card className='mb-2' key={answer.id}>
                      <ListGroup.Item className='border-0'>
                        <div className='answer-piece mb-3' dangerouslySetInnerHTML={{__html: answer.ansContent}} />
                        <p className='date-user text-muted mb-0 px-0'>
                          answered on {answer.answeredOn && formatDate(answer.answeredOn)} by {answer.displayName ? answer.displayName : '[deleted]'}
                        </p>
                      </ListGroup.Item>
                    </Card>
                ))}
              </ListGroup>
            </Card.Body>

            <Card.Body className='post-answer'>
              <div className='text-center'>
                <span className='material-icons-outlined mr-2 idea-icon'>lightbulb</span>
                Feel like something is missing or have a brilliant idea?
                <p>Post your answer.</p>
              </div>

              <Form noValidate>
                <Form.Group controlId='formGroupTextarea'>
                  <Form.Label className='font-weight-bold'>Your answer</Form.Label>
                  <EditorComponent />
                </Form.Group>
                <div className='text-right'>
                  <Button className='qa-btn' type='submit' href={`/questions/${id}`}>Add your answer</Button>
                </div>
              </Form>

            </Card.Body>
          </div>
        </Card>
      </Container>
  )
}

export default QuestionPublic
