import { useAuth } from '../Auth/AuthContext'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import React from "react";

function KeywordItem({ id, name, count }) {
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
          <small>{count} question{count != 1 && 's'}</small>
        </Card.Footer>
      </Card>
  )
}

export default KeywordItem
