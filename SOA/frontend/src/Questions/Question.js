import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import { formatDate } from '../lib'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const axios = require('axios')
const browse_url = process.env.REACT_APP_BROWSE_URL
const answer_url = process.env.REACT_APP_ANSWER_URL

function Question() {
  const [question, setQuestion] = useState({})
  const [answerText, setAnswerText] = useState('')
  const [validated, setValidated] = useState(false)

  const { id } = useParams()
  const { token, logout } = useAuth()

  // get question
  useEffect(() => {
    const config = { headers: { 'Authorization': `Bearer ${token}` } }

    axios.get(`${browse_url}/question?id=${id}`, config)
        .then(response => setQuestion(response.data))
        .catch(error => {
          const status = error.response?.status
          // if unauthorized, prompt user to log in again
          if (status === 401) {
            logout()
            window.location.reload()
          }
        })
  }, [])

  // post new answer
  const handleSubmit = e => {
    e.preventDefault()

    const form = e.currentTarget
    if (!form.checkValidity()) {
      e.stopPropagation()
      setValidated(true)
    } else {
      const answer = {
        ansContent: answerText,
        question: question
      }
      const config = { headers: { 'Authorization': `Bearer ${token}` } }

      axios.post(`${answer_url}/create`, answer, config)
          .then(() => window.location.reload(true))
          .catch(error => {
            const status = error.response?.status
            // if unauthorized, prompt user to log in again
            if (status === 401) {
              logout()
              window.location.reload()
            }
          })
    }
  }

  return (
      <div  className='w-100' style={{ maxWidth: '950px' }}>
        <Card.Header className='py-4'>
          <h5 className='font-weight-bold mb-0'>{question.title}</h5>
        </Card.Header>

        <Card.Body className='question'>
          <p>{question.questContent}</p>
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
                    <p>{answer.ansContent}</p>
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

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId='formGroupTextarea'>
              <Form.Label className='font-weight-bold'>Your answer</Form.Label>
              <Form.Control
                  as='textarea'
                  name='answer-text'
                  onChange={e => setAnswerText(e.target.value)}
                  style={{ height: '175px' }}
                  required
              />
              <Form.Control.Feedback type='invalid'>
                Answer cannot be empty
              </Form.Control.Feedback>
            </Form.Group>
            <div className='text-right'>
              <Button className='qa-btn' type='submit'>Add your answer</Button>
            </div>
          </Form>

        </Card.Body>
      </div>
  )
}

export default Question
