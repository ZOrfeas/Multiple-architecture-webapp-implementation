import { useAuth } from '../Auth/AuthContext'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import React from "react";

function QPerKeywordItem({ id, name, count }) {
  const { user } = useAuth()
  const formatName = name.split(' ').join('-')

  return (
      <Card>
        <Card.Body className='d-flex justify-content-center'>
          <Badge className='keyword-badge'>
            {user
            ? <Link to={{ pathname: `/questions/keyword/${formatName}`, state: { id, name } }}>{name}</Link>
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
