import './Public.css'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Home from './Home'
import QPerKeyword from './QPerKeyword'
import QAPerDay from './QAPerDay'
import BrowseQuestionsPublic from './BrowseQuestionsPublic'
import QuestionPublic from './QuestionPublic'
import Container from 'react-bootstrap/Container'

function Public() {
  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/keywords' component={QPerKeyword} />
            <Route path='/calendar' component={QAPerDay} />
            <Route path='/public-questions/:id' component={QuestionPublic} />
            <Route path='/public-questions' component={BrowseQuestionsPublic} />
          </Switch>
        </Container>
        <Footer />
      </div>
  )
}

export default Public
