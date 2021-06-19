import Form from 'react-bootstrap/Form'

function UserDetails({ name, email }) {
  return (
      <Form className='tab-wrapper py-5'>
        <Form.Group>
          <Form.Label className='font-weight-bold'>Display name</Form.Label>
          <Form.Control type='text' defaultValue={name} readOnly />
        </Form.Group>

        <Form.Group>
          <Form.Label className='font-weight-bold'>Email</Form.Label>
          <Form.Control type='email' defaultValue={email} readOnly />
        </Form.Group>
      </Form>
  )
}

export default UserDetails
