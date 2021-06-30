import './Home.css'
import React from 'react'
import { useAuth } from '../Auth/AuthContext'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

function Home() {
  const { user } = useAuth()

  return (
      <Container className='home-content d-flex py-5'>
        <Card>
          <div className='home-header text-center mt-4 pt-5'>
            <h2>Welcome to <span className='ama-logo'>AskMeAnything</span></h2>
            <h5>An AMA service done simple.</h5>
          </div>

          <Card.Body className='d-flex align-items-center'>
            <CardDeck>
              <Card border='primary'>
                <Card.Header className='font-weight-bold text-center'>
                  Say it with a keyword
                </Card.Header>
                <Card.Body>
                  <div className='d-flex justify-content-center align-items-center-center mt-2 mb-5'>
                    <span className='material-icons-outlined home-icon'>tag</span>
                  </div>
                  <Card.Text className='text-center'>
                    Keywords are special tags used to describe a question, categorize it
                    and make it more discoverable.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <a className='home-link' href='/keywords'>Show keywords</a>
                </Card.Footer>
              </Card>

              <Card border='primary'>
                <Card.Header className='font-weight-bold text-center'>
                  What's trending
                </Card.Header>
                <Card.Body>
                  <div className='d-flex justify-content-center align-items-center-center mt-2 mb-5'>
                    <span className='material-icons-outlined home-icon'>trending_up</span>
                  </div>
                  <Card.Text className='text-center'>
                    Check the AMA traffic by viewing the number of questions and answers
                    posted over time.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <a className='home-link' href='/calendar'>Show calendar</a>
                </Card.Footer>
              </Card>

              <Card border='primary'>
                <Card.Header className='font-weight-bold text-center'>
                  AMA time
                </Card.Header>
                <Card.Body className='text-center'>
                  <div className='d-flex justify-content-center align-items-center-center mt-2 mb-5'>
                    <span className='material-icons-outlined home-icon'>question_answer</span>
                  </div>
                  <Card.Text>
                    Whatever the topic, describe your situation, include the right keywords
                    and let the community handle the rest.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <a className='home-link' href='/questions/ask'>Ask a question</a>
                </Card.Footer>
              </Card>

              <Card border='primary'>
                <Card.Header className='font-weight-bold text-center'>
                  Explore the knowledge
                </Card.Header>
                <Card.Body className='text-center'>
                  <div className='d-flex justify-content-center align-items-center-center mt-2 mb-5'>
                    <span className='material-icons-outlined home-icon'>search</span>
                  </div>
                  <Card.Text>
                    Browse through questions, find the right answers for your problem
                    or contribute with yours.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <a className='home-link' href={user ? '/questions' : '/public-questions'}>Browse and answer questions</a>
                </Card.Footer>
              </Card>
            </CardDeck>
          </Card.Body>
        </Card>
      </Container>
  )
}

export default Home
