import './QuestionsPerKeyword.css'
import { useState } from 'react'
import Keyword from './Keyword'
import PaginationComponent from '../Pagination/Pagination'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const data = require('./keywords.json')

function QuestionsPerKeyword() {
  const [keywords] = useState(data)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(48) // multiples of 6

  // Get current keywords
  const offset = (currentPage - 1) * pageSize
  const currentKeywords = keywords.slice(offset, offset + pageSize)

  return (
      <Container className='keywords-content py-5'>
        <Card>
          <Card.Body>
            <Row>
              {currentKeywords.map(keyword => (
                  <Col key={keyword.name} className='pb-3' xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Keyword name={keyword.name} count={keyword.questions} />
                  </Col>
              ))}
            </Row>
            <PaginationComponent
                totalItems={keywords.length}
                pageSize={pageSize}
                pageRange={5}
                pageState={[currentPage, setCurrentPage]}
            />
          </Card.Body>
        </Card>
      </Container>
  )
}

export default QuestionsPerKeyword
