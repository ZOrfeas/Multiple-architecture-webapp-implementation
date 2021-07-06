import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import BrowseQuestions from './BrowseQuestions'
import Question from './Question'
import AskQuestion from './AskQuestion'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

function QuestionsRoute() {
  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='questions-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <Switch>
                <Route exact path='/questions/ask' component={AskQuestion} />
                <Route exact path='/questions/:id' component={Question} />
                <Route path={['/questions', '/questions/keyword/:id']} component={BrowseQuestions} />
              </Switch>
            </Card>
          </Container>
        </Container>
        <Footer />
      </div>
  )
}

export default QuestionsRoute
