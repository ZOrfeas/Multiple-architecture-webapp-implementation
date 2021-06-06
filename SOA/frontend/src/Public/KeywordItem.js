import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

function KeywordItem({ name, count }) {
  return (
      <Card>
        <Card.Body className='d-flex justify-content-center'>
          <Badge className='keyword-badge'>{name}</Badge>
        </Card.Body>
        <Card.Footer className='text-center text-muted'>
          <small>{count} question{count != 1 && 's'}</small>
        </Card.Footer>
      </Card>
  )
}

export default KeywordItem
