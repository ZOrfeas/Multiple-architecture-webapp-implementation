import React from 'react'
import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'

function BrowseQuestionItem({ id, title, summary, keywords, setId, setPage, askedOn, askedBy, answerCount }) {
  const formatDate = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  const formatName = name => name.split(' ').join('-')

  return (
      <div className='d-flex'>
        <div className='question-item'>
          <h5 className='question-title'><Link to={setId ? `/questions/${id}` : `/public-questions/${id}`}>{title}</Link></h5>
          <p className='question-summary small mb-2'>{summary}</p>
          <div className='keywords mb-2'>
            {keywords.map(keyword => (
                <Badge key={keyword.id} className='keyword-badge mr-1'>
                  {setId
                  ? <Link
                          to={{
                            pathname: `/questions/keyword/${formatName(keyword.name)}`,
                            state: { id: keyword.id, name: keyword.name }
                          }}
                          onClick={() => {
                            setId(keyword.id)
                            setPage(1)
                          }}
                      >
                        {keyword.name}
                      </Link>
                  : <span>{keyword.name}</span>}
                </Badge>
            ))}
          </div>
          <div className='d-flex'>
            <p className='date-user text-muted mb-0 px-0'>asked on {formatDate(askedOn)} by {askedBy ? askedBy : '[deleted]'}</p>
            <div className='stats d-md-none ml-auto'>
              {answerCount > 0 &&
              <div className='answer-count'>
                <span className='material-icons-outlined mr-1 answer-icon'>question_answer</span>
                <span className='small'>{answerCount}</span>
              </div>}
            </div>
          </div>
        </div>

        <div className='stats d-none d-md-block flex-shrink-0 text-right ml-3'>
          {answerCount > 0 &&
          <div className='answer-count'>
            <span className='material-icons-outlined mr-1 answer-icon'>question_answer</span>
            <span className='small'>{answerCount}</span>
          </div>}
        </div>
      </div>
  )
}

export default BrowseQuestionItem;
