import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_QUESTION_URL

function AskQuestion() {
  const [title, setTitle] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [keywordsAll, setKeywordsAll] = useState([])
  const [keywordsSelected, setKeywordsSelected] = useState([])

  const history = useHistory()

  // get all keywords and fill select form control
  useEffect(() => {
    axios.get(`${url}/getAllKeywords`)
        .then(response => {
          setKeywordsAll(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [])

  // get selected keywords and fill keywords div
  const handleSelect = e => {
    const select = e.target
    const id = select.children[select.selectedIndex].id
    const name = e.target.value
    if (id !== '' && keywordsSelected.length < 5) {
      setKeywordsSelected(prev => [...prev, { id: parseInt(id), name }])
    }
  }

  // post new question
  const handleSubmit = e => {
    e.preventDefault()
    const question = {
      title: title,
      questContent: questionText,
      keywords: keywordsSelected
    }
    const token = JSON.parse(localStorage.getItem('token'))
    const config = { headers: { 'Authorization': `Bearer ${token}` } }

    axios.post(`${url}/create`, question, config)
        .then(() => {
          history.push('/questions')
        })
        .catch(error => {
          console.log(error)
        })
  }

  return (
      <div  className='w-100' style={{ maxWidth: '950px' }}>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId='formGroupTitle'>
              <Form.Label className='font-weight-bold'>Title</Form.Label>
              <Form.Control
                  type='text'
                  name='title'
                  onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='formGroupTextarea'>
              <Form.Label className='font-weight-bold'>Your question</Form.Label>
              <Form.Control
                  as='textarea'
                  name='question-text'
                  onChange={e => setQuestionText(e.target.value)}
                  style={{ height: '175px' }}
                  required
              />
              <Form.Control.Feedback type='invalid'>
              </Form.Control.Feedback>
            </Form.Group>

            <div>
              <label className='font-weight-bold'>Keywords</label>
              <span className={'keyword-count small ml-2' + (keywordsSelected.length === 0 ? ' text-muted' : '')}>
                {keywordsSelected.length}/5
              </span>
            </div>
            <div className='keywords mb-5'>
              {keywordsSelected.map(keyword => (
                  <Badge key={keyword.id} className='keyword-badge mr-1'>{keyword.name}</Badge>
              ))}
            </div>

            <Form.Group controlId='formGroupKeywords'>
              <Form.Label>Select keywords</Form.Label>
              <Form.Control as='select' onChange={handleSelect}>
                <option></option>
                {keywordsAll.map(keyword1 => {
                  return keywordsSelected.every(keyword2 => keyword1.id !== keyword2.id) ?
                      <option key={keyword1.id} id={keyword1.id}>{keyword1.name}</option> : null
                })}
              </Form.Control>
            </Form.Group>
            <div className='text-right'>
              <Button variant='success' type='submit'>Ask your question</Button>
            </div>
          </Form>
        </Card.Body>
      </div>
  )
}

export default AskQuestion
