import './User.css'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../Auth/AuthContext'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

const axios = require('axios')
const url = process.env.REACT_APP_ACCOUNT_URL

function User() {
  const [accountInfo, setAccountInfo] = useState({})

  const { token, logout } = useAuth()

  useEffect(() => {
    const config = { headers: { 'Authorization': `Bearer ${token}` } }
    axios.get(`${url}/info`, config)
        .then(response => {
          setAccountInfo(response.data)
          console.log(response.data)
        })
        .catch(error => {
          const status = error.response?.status
          // if unauthorized, prompt user to log in again
          if (status === 401) {
            logout()
            window.location.reload()
          }
        })
  }, [])

  const formatDate = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  const getLastAct = () => {
    if (!accountInfo.ansCount && !accountInfo.questCount) {
      return 'No activity yet'
    }
    const lastQ = accountInfo.questions[0]?.askedOn
    const lastA = accountInfo.answers[0]?.answeredOn
    const date = lastQ === undefined ? lastA : (lastA === undefined ? lastQ : (lastA > lastQ ? lastA : lastQ))
    return `Last activity on ${formatDate(date)}`
  }

  const handleSelect = e => {
    console.log(e)
  }

  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='user-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <div className='w-100' style={{ maxWidth: '950px' }}>
                <Card.Header className='border-bottom-0'>
                  <Row className='mx-0'>
                    <Col xs={4} md={2} className='d-flex align-items-center justify-content-center icon'>
                      <span className='material-icons-sharp profile-icon'>person</span>
                    </Col>

                    <Col xs={8} md={5} lg={6} className='mt-3 py-2'>
                      <h5>{accountInfo.displayName}</h5>
                    </Col>

                    <Col md={5} lg={4} className='user-stats mt-3 py-2'>
                      <p className='small'>
                        <span className='material-icons-outlined mr-2 stats-icon'>live_help</span>
                        <span className='font-weight-bold'>{accountInfo.questCount}</span> question{accountInfo.questCount !== 1 && 's'}
                      </p>
                      <p className='small'>
                        <span className='material-icons-outlined mr-2 stats-icon'>question_answer</span>
                        <span className='font-weight-bold'>{accountInfo.ansCount}</span> answer{accountInfo.ansCount !== 1 && 's'}
                      </p>
                      <p className='small mb-0'>
                        <span className='material-icons-outlined mr-2 stats-icon'>schedule</span>
                        {getLastAct()}
                      </p>
                    </Col>
                  </Row>
                </Card.Header>

                <Card.Body>
                  <Nav variant='tabs' defaultActiveKey='d' onSelect={handleSelect}>
                    <Nav.Item>
                      <Nav.Link eventKey='d'>Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey='q'>Questions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey='a'>Answers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </div>
            </Card>
          </Container>
        </Container>
        <Footer />
      </div>
  )
}

export default User
