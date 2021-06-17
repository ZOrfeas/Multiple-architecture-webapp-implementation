import './Questions.css'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BrowseQuestionItem from './BrowseQuestionItem'
import PaginationComponent from '../Pagination/Pagination'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function BrowseQuestions() {
  const location = useLocation()

  const [keywordId, setKeywordId] = useState(location.state?.id)
  const [questions, setQuestions] = useState([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // get total number of questions and questions for current page
  useEffect(() => {
    // get only questions with particular keyword if id is defined
    const service = keywordId ? `questionsByKeywords?id=${keywordId}` : `questions`
    const sep = keywordId ? '&' : '?'
    try {
      axios.get(`${url}/count/${service}`)
          .then(response => setTotalQuestions(response.data))
      axios.get(`${url}/${service}${sep}pagesize=${pageSize}&pagenr=${currentPage}`)
          .then(response => setQuestions(response.data))
    } catch(error) {
      console.log(error)
    }
  }, [keywordId, currentPage])

  return (
      <div className='w-100' style={{ maxWidth: '950px' }}>
        <Card.Header className='py-4'>
          <div className='px-4'>
            <div className='text-center px-0'>
              <h5>
                <span className='material-icons-outlined mr-2 hand-icon'>waving_hand</span>
                Want to contribute to <span className='ama-logo'>AskMeAnything</span>?
              </h5>
              <p className='mb-4'>Ask a question or help others answer theirs.</p>
            </div>
            <Row className='align-items-center mx-0 mb-2'>
              <Col className='px-0'>
                <h5 className='font-weight-bold mb-0'>
                  {keywordId ? `Questions with keyword '${location.state?.name}'` : 'All questions'}
                </h5>
              </Col>
              <Col className='px-0 text-right'>
                <Button variant='success' href='/questions/ask'>Ask a question</Button>
              </Col>
            </Row>
            <div className='px-0'>
              {totalQuestions} question{totalQuestions !== 1 && 's'}
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          <ListGroup variant='flush'>
            {questions.map(question => (
                <ListGroup.Item  key={question.id}>
                  <BrowseQuestionItem
                      id={question.id}
                      title={question.title}
                      summary={question.questContent}
                      keywords={question.keywords}
                      setId={setKeywordId}
                      setPage={setCurrentPage}
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
      </div>
  )
}

export default BrowseQuestions
