import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function Question() {
  const [question, setQuestion] = useState([])
  const { id } = useParams()

  useEffect(() => {
    axios.get(`${url}/question?id=${id}`)
        .then(response => {
          setQuestion(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [])

  const dateFormat = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
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
            asked on {question.askedOn && dateFormat(question.askedOn)} by {question.user?.displayName ? question.user.displayName : '[deleted]'}
          </p>
        </Card.Body>
        <Card.Body className='answers'>
          <p>
            {question.answers?.length !== undefined && `${question.answers.length} answer`}
            {question.answers?.length !== undefined && question.answers.length != 1 && 's'}
          </p>
          <ListGroup className="list-group-flush">
            {question.answers &&
            question.answers.map(answer => (
                <ListGroup.Item key={answer.id}>
                  <p>{answer.ansContent}</p>
                  <p className='date-user text-muted mb-0 px-0'>
                    answered on {answer.answeredOn && dateFormat(answer.answeredOn)} by {answer.displayName ? answer.displayName : '[deleted]'}
                  </p>
                </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Body>
          <div className='text-center'>
            <span className='material-icons-outlined mr-2 idea-icon'>lightbulb</span>
            Feel like something is missing or have a brilliant idea?
            <p>Post your answer.</p>
          </div>
          <div className='text-right'>
            <Button variant='success'>Add your answer</Button>
          </div>
        </Card.Body>
      </div>
  )
}

export default Question
