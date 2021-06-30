import './User.css'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../Auth/AuthContext'
import { formatDate } from '../lib'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import UserDetails from './UserDetails'
import UserQA from './UserQA'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const axios = require('axios')
const url = process.env.REACT_APP_ACCOUNT_URL

function User() {
  const [accountInfo, setAccountInfo] = useState({})

  const { token, logout } = useAuth()

  // get user account info
  useEffect(() => {
    const config = { headers: { 'Authorization': `Bearer ${token}` } }
    axios.get(`${url}/info`, config)
        .then(response => setAccountInfo(response.data))
        .catch(error => {
          const status = error.response?.status
          // if unauthorized, prompt user to log in again
          if (status === 401) {
            logout()
            window.location.reload()
          }
        })
  }, [])

  const getLastAct = () => {
    if (!accountInfo.ansCount && !accountInfo.questCount) {
      return 'No activity yet'
    }
    const lastQ = accountInfo.questions[0]?.askedOn
    const lastA = accountInfo.answers[0]?.answeredOn
    const date = lastQ === undefined ? lastA : (lastA === undefined ? lastQ : (lastA > lastQ ? lastA : lastQ))
    return `Last activity on ${formatDate(date)}`
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
                    <Col xs={4} md={2} className='d-flex align-items-center justify-content-center'>
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
                  <Tabs className='user-tabs mb-3 px-0' defaultActiveKey='1'>
                    <Tab eventKey='1' title='Details'>
                      <UserDetails
                          name={accountInfo.displayName}
                          email={accountInfo.email}
                      />
                    </Tab>
                    <Tab eventKey='2' title='Questions'>
                      {Object.keys(accountInfo).length !== 0 &&
                      <UserQA
                          userId={accountInfo.id}
                          q
                          count={accountInfo.questCount}
                          data={accountInfo.questions}
                      />}
                    </Tab>
                    <Tab eventKey='3' title='Answers'>
                      {Object.keys(accountInfo).length !== 0 &&
                      <UserQA
                          userId={accountInfo.id}
                          count={accountInfo.ansCount}
                          data={accountInfo.answers}
                      />}
                    </Tab>
                  </Tabs>
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
