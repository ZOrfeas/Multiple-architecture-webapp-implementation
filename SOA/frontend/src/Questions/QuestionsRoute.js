import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import BrowseQuestions from './BrowseQuestions';
import Question from './Question';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

function QuestionsRoute() {
  return (
      <Router>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='questions-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <Route exact path='/questions' component={BrowseQuestions} />
              <Route path='/questions/:id' component={Question} />
            </Card>
          </Container>
        </Container>
        <Footer />
      </Router>
  )
}

export default QuestionsRoute
