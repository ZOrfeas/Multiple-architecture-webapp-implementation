import './QPerKeyword.css'
import React, { useState, useEffect } from 'react'
import QPerKeywordItem from './QPerKeywordItem'
import PaginationComponent from '../Pagination/Pagination'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const axios = require('axios')
const url = process.env.REACT_APP_BROWSE_URL

function QPerKeyword() {
  const [keywords, setKeywords] = useState([])
  const [totalKeywords, setTotalKeywords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(48) // multiples of 6

  useEffect(() => {
    try {
      axios.get(`${url}/count/keywords`)
          .then(response => setTotalKeywords(response.data))
      axios.get(`${url}/keywordsByPopularity?pagesize=${pageSize}&pagenr=${currentPage}`)
          .then(response => setKeywords(response.data))
    } catch(error) {
      console.log(error)
    }
  }, [currentPage])

  return (
      <Container className='q-per-keyword-content py-5'>
        <Card>
          <Card.Header className='py-4'>
            <h5 className='mb-0'>Keywords</h5>
          </Card.Header>

          <Card.Body>
            <Row>
              {keywords.map(keyword => (
                  <Col key={keyword.keywordId} className='pb-3' xs={6} md={4} lg={3} xl={2}>
                    <QPerKeywordItem id={keyword.keywordId} name={keyword.name} count={keyword.occurrencies} />
                  </Col>
              ))}
            </Row>
            <PaginationComponent
                totalItems={totalKeywords}
                pageSize={pageSize}
                pageRange={5}
                pageState={[currentPage, setCurrentPage]}
            />
          </Card.Body>
        </Card>
      </Container>
  )
}

export default QPerKeyword
