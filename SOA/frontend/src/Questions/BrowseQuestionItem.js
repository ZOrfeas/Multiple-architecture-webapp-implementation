import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'

function BrowseQuestionItem({ id, title, summary, keywords, askedOn, askedBy, answerCount }) {
  const dateFormat = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  return (
      <div className='d-flex'>
        <div className='question-item p-2'>
          <h5 className='question-title'><Link to={`/questions/${id}`}>{title}</Link></h5>
          <p className='question-summary small mb-2'>{summary}</p>
          <div className='keywords mb-2'>
            {keywords.map(keyword => (
                <Badge key={keyword.id} className='keyword-badge mr-1'>{keyword.name}</Badge>
            ))}
          </div>
          <p className='date-user text-muted mb-0 px-0'>asked on {dateFormat(askedOn)} by {askedBy ? askedBy : '[deleted]'}</p>
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
