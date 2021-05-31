import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function Question() {
  return (
      <div>
        <h5><Link to='#'>Title</Link></h5>
        <p className='question-p small'>
          Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
        </p>
        <Row className='mx-0'>
          <Col className='mb-2 px-0' md={8}>
            <Badge className='keyword-badge mr-1'>java</Badge>
            <Badge className='keyword-badge mr-1'>arrays</Badge>
            <Badge className='keyword-badge mr-1'>java</Badge>
            <Badge className='keyword-badge mr-1'>arrays</Badge>
            <Badge className='keyword-badge mr-1'>java</Badge>
            <Badge className='keyword-badge mr-1'>arrays</Badge>
          </Col>
          <Col className='mb-2 px-0' md={4}>
            <p className='blue small text-right mb-0'>
              2 answers
              <i className='material-icons-outlined ml-2 answer-icon'>question_answer</i>
            </p>
          </Col>
          <p className='small text-muted text-right mb-0 px-0'>
            asked Aug 1 '08 at 12:30
          </p>
          <p className='blue small text-right mb-0 px-0'>
            Hugh J
          </p>
        </Row>
      </div>
  )
}

export default Question;
