import './Footer.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Footer() {
  return (
      <Container fluid className='footer text-center py-3'>
        <Row className='mb-4'>
          <Col><a href='#'>About</a></Col>
          <Col><a href='#'>Contact us</a></Col>
          <Col><a href='#'>GitHub</a></Col>
        </Row>
        <Row>
          <small>
            &copy; {new Date().getFullYear()} AskMeAnything Inc.
          </small>
        </Row>
      </Container>
  )
}

export default Footer
