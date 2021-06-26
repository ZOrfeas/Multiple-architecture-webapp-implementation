import './Public.css'
import React from 'react'
import { Route } from 'react-router-dom'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Home from './Home'
import QPerKeyword from './QPerKeyword'
import QAPerDay from './QAPerDay'
import Container from 'react-bootstrap/Container'

function Public() {
  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Route exact path='/' component={Home} />
          <Route path='/keywords' component={QPerKeyword} />
          <Route path='/calendar' component={QAPerDay} />
        </Container>
        <Footer />
      </div>
  )
}

export default Public
