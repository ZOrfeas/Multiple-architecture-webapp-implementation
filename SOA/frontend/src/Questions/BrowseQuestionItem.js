import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import React from "react";

function BrowseQuestionItem({ id, title, summary, keywords, setId, setPage, askedOn, askedBy, answerCount }) {
  const formatDate = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  const formatName = name => name.split(' ').join('-')

  return (
      <div className='d-flex'>
        <div className='question-item p-2'>
          <h5 className='question-title'><Link to={`/questions/${id}`}>{title}</Link></h5>
          <p className='question-summary small mb-2'>{summary}</p>
          <div className='keywords mb-2'>
            {keywords.map(keyword => (
                <Badge key={keyword.id} className='keyword-badge mr-1'>
                  <Link
                      to={{
                        pathname: `/questions/keyword/${formatName(keyword.name)}`,
                        state: { id: keyword.id, name: keyword.name }
                      }}
                      onClick={e => {
                        setId(keyword.id)
                        setPage(1)
                      }}
                  >
                    {keyword.name}
                  </Link>
                </Badge>
            ))}
          </div>
          <p className='date-user text-muted mb-0 px-0'>asked on {formatDate(askedOn)} by {askedBy ? askedBy : '[deleted]'}</p>
        </div>
        <div className='stats d-none d-md-block flex-shrink-0 text-right ml-3 p-2'>
          {answerCount > 0 &&
          <div className='answer-count'>
            <span className='material-icons-outlined mr-1 qa-icon'>question_answer</span>
            <span className='small'>{answerCount}</span>
          </div>}
        </div>
      </div>
  )
}

export default BrowseQuestionItem;
