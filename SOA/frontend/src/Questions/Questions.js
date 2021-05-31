import './Questions.css'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Question from './Question';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

function Questions() {
  return (
      <div>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Container className='questions-content py-5'>
            <Card className='d-flex align-items-center justify-content-center'>
              <Card.Body className='w-100' style={{ maxWidth: '750px' }}>
                <ListGroup variant='flush'>
                  {[1,2,3].map(key => (
                      <ListGroup.Item  key={key}>
                        <Question />
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Container>
        </Container>
        <Footer />
      </div>
  )
}

export default Questions
