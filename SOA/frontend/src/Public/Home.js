import './Home.css'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

function Home() {
  return (
      <Container className='home-content d-flex align-items-center'>
        <CardDeck>
          <Card>
            <Card.Header className='text-center'>Keywords</Card.Header>
            <Card.Body>
              <div className='d-flex justify-content-center align-items-center-center mb-3'>
                <span className='material-icons-sharp home-icon'>tag</span>
              </div>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Varius sit amet mattis vulputate enim nulla aliquet.
              </Card.Text>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Button href='/keywords'>Show keywords</Button>
            </Card.Footer>
          </Card>

          <Card>
            <Card.Header className='text-center'>Trends</Card.Header>
            <Card.Body>
              <div className='d-flex justify-content-center align-items-center-center mb-3'>
                <span className='material-icons-sharp home-icon'>trending_up</span>
              </div>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Varius sit amet mattis vulputate enim nulla aliquet.
              </Card.Text>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Button href='#'>Show calendar</Button>
            </Card.Footer>
          </Card>

          <Card>
            <Card.Header className='text-center'>Questions</Card.Header>
            <Card.Body>
              <div className='d-flex justify-content-center align-items-center-center mb-3'>
                <span className='material-icons-sharp home-icon'>question_answer</span>
              </div>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Varius sit amet mattis vulputate enim nulla aliquet.
              </Card.Text>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Button href='#'>Ask a question</Button>
            </Card.Footer>
          </Card>

          <Card>
            <Card.Header className='text-center'>Answers</Card.Header>
            <Card.Body>
              <div className='d-flex justify-content-center align-items-center-center mb-3'>
                <span className='material-icons-sharp home-icon'>search</span>
              </div>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Varius sit amet mattis vulputate enim nulla aliquet.
              </Card.Text>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Button href='/questions'>Browse and answer questions</Button>
            </Card.Footer>
          </Card>
        </CardDeck>
      </Container>
  )
}

export default Home
