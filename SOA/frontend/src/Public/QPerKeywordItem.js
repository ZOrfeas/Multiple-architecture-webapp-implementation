import React from 'react'
import { useAuth } from '../Auth/AuthContext'
import { Link } from 'react-router-dom'
import { formatName } from '../lib'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

function QPerKeywordItem({ id, name, count }) {
  const { user } = useAuth()

  return (
      <Card>
        <Card.Body className='d-flex justify-content-center'>
          <Badge className='keyword-badge'>
            {user
            ? <Link to={{ pathname: `/questions/keyword/${formatName(name)}`, state: { id, name } }}>{name}</Link>
            : <span>{name}</span>}
          </Badge>
        </Card.Body>
        <Card.Footer className='text-center text-muted'>
          {count > 0 &&
          <div className='question-count'>
            <span className='material-icons-outlined mr-1 question-icon'>live_help</span>
            <span className='small'>{count}</span>
          </div>}
        </Card.Footer>
      </Card>
  )
}

export default QPerKeywordItem
