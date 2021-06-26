import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_QUESTION_URL

function AskQuestion() {
  const [title, setTitle] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [keywordsAll, setKeywordsAll] = useState([])
  const [keywordsSelected, setKeywordsSelected] = useState([])
  const [validated, setValidated] = useState(false)

  const history = useHistory()
  const { token, logout } = useAuth()

  // get all keywords
  useEffect(() => {
    axios.get(`${url}/getAllKeywords`)
        .then(response => setKeywordsAll(response.data))
        .catch(error => {
          console.log(error)
        })
  }, [])

  // get selected keywords
  const handleChange = e => {
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
    if (title === '' || questionText === '' || keywordsSelected.length === 0) {
      e.stopPropagation()
      setValidated(true)
    }
    else {
      const question = {
        title: title,
        questContent: questionText,
        keywords: keywordsSelected
      }
      const config = { headers: { 'Authorization': `Bearer ${token}` } }

      axios.post(`${url}/create`, question, config)
          .then(() => history.push('/questions'))
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

  // cancel selected keyword
  const handleClick = e => {
    const id = parseInt(e.currentTarget.parentElement.parentElement.id)
    setKeywordsSelected(prev => prev.filter(keyword => keyword.id !== id))
  }

  return (
      <div className='w-100' style={{ maxWidth: '950px' }}>
        <Card.Header className='py-4'>
          <h5 className='font-weight-bold mb-0'>
            Ask a public question
          </h5>
        </Card.Header>

        <Card.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId='formGroupTitle'>
              <Form.Label className='font-weight-bold mb-0'>Title</Form.Label>
              <Form.Text className='text-muted mt-0 mb-1'>
                Select a title that best summarizes your question
              </Form.Text>
              <Form.Control
                  type='text'
                  name='title'
                  onChange={e => setTitle(e.target.value)}
                  isInvalid={validated && title === ''}
                  isValid={validated && title !== ''}
              />
              <Form.Control.Feedback type='invalid'>
                Title cannot be empty
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='formGroupTextarea'>
              <Form.Label className='font-weight-bold mb-0'>Your question</Form.Label>
              <Form.Text className='text-muted mt-0 mb-1'>
                Be specific and provide information needed for your question to be answered
              </Form.Text>
              <Form.Control
                  as='textarea'
                  name='question-text'
                  onChange={e => setQuestionText(e.target.value)}
                  isInvalid={validated && questionText === ''}
                  isValid={validated && questionText !== ''}
                  style={{ height: '175px' }}
              />
              <Form.Control.Feedback type='invalid'>
                Question cannot be empty
              </Form.Control.Feedback>
            </Form.Group>

            <label className='font-weight-bold'>Keywords</label>
            <span className={'keyword-count small ml-2' + (keywordsSelected.length === 0 ? ' text-muted' : '')}>
              {keywordsSelected.length}/5
            </span>
            <div className='keywords-selected mb-5'>
              {keywordsSelected.map(keyword => (
                  <Badge key={keyword.id} className='keyword-badge mr-1' id={keyword.id}>
                    <div className='d-flex align-items-center'>
                      {keyword.name}
                      <button className='keyword-cancel close ml-2' type='button' onClick={handleClick}>
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                  </Badge>
              ))}
            </div>

            <label className='mb-0'>Select keywords</label>
            <p className='small text-muted mt-0 mb-1'>
              Add up to 5 keywords to describe the main points of your question
            </p>
            <InputGroup className='mb-3' controlId='formGroupKeywords'>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <span className='material-icons-sharp tag-icon'>tag</span>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                  as='select'
                  onChange={handleChange}
                  isInvalid={validated && keywordsSelected.length === 0}
                  isValid={validated && keywordsSelected.length !== 0}
                  disabled={keywordsSelected.length === 5}
                  custom
              >
                <option></option>
                {keywordsAll.map(keyword1 => (
                  keywordsSelected.every(keyword2 => keyword1.id !== keyword2.id)
                      ? <option key={keyword1.id} id={keyword1.id}>{keyword1.name}</option>
                      : null
                ))}
              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                At least 1 keyword must be added
              </Form.Control.Feedback>
            </InputGroup>
            <div className='text-right'>
              <Button className='qa-btn' type='submit'>Ask your question</Button>
            </div>
          </Form>
        </Card.Body>
      </div>
  )
}

export default AskQuestion
