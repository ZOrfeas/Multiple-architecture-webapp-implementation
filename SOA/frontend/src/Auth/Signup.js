import './Signup.css'
import React, { useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Formik } from 'formik'
import { signupSchema } from './Schema'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_AUTH_URL
// const url = 'http://localhost:3001'

function Signup() {
  const [showMsg, setShowMsg] = useState(false)

  const { login } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const alert  = location.state?.alert

  const handleSubmit = values => {
    axios.post(`${url}/signup`, values)
        .then(response => {
          const { user, token } = response.data
          login({ user, token  })
          history.push('/')
        })
        .catch(error => {
          const status = error.response.status
          const message = error.response.data?.message
          if (status === 400 && message === 'Email already exists') { // user already exists
            setShowMsg(true)
          }
          else {
            console.log(error)
          }
        })
  }

  return (
      <Container className='signup-content d-flex align-items-center justify-content-center py-5'>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          <Card className='border-0'>
            <Card.Header as='h4' className='text-center border-bottom-0 p-4'>AskMeAnything</Card.Header>
            <Card.Body className='p-4'>
              {alert &&
              <Alert className='mb-5' variant='warning'>
                <div>
                  <p className='text-center mb-0'>You must me logged in to ask a question</p>
                  <p className='text-center mb-0'>Sign up or <Link to={{ pathname: '/login', state: location.state }}>Log in</Link></p>
                </div>
              </Alert>}
              <Formik
                  initialValues={{
                    displayName: '',
                    username: '',
                    password: '',
                    re_password: ''
                  }}
                  validationSchema={signupSchema}
                  onSubmit={({ displayName, username, password }, { setSubmitting }) => {
                    handleSubmit({ displayName, username, password })
                    setSubmitting(false)
                  }}
              >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    errors
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group controlId='formGroupDisplayName'>
                        <Form.Label className='font-weight-bold'>Display name</Form.Label>
                        <Form.Control
                            type='text'
                            name='displayName'
                            value={values.displayName}
                            onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group controlId='formGroupUsername'>
                        <Form.Label className='font-weight-bold'>Email</Form.Label>
                        <Form.Control
                            type='email'
                            name='username'
                            autoComplete='username'
                            value={values.username}
                            onChange={e => {
                              if (showMsg) {
                                setShowMsg(false)
                              }
                              handleChange(e)
                            }}
                            onBlur={handleBlur}
                            isInvalid={(touched.username && errors.username) || showMsg}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {showMsg ? 'Email already exists' : errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId='formGroupPassword'>
                        <Form.Label className='font-weight-bold'>Password</Form.Label>
                        <Form.Control
                            type='password'
                            name='password'
                            autoComplete='new-password'
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && errors.password}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId='formGroupRePassword'>
                        <Form.Label className='font-weight-bold'>Retype password</Form.Label>
                        <Form.Control
                            type='password'
                            name='re_password'
                            autoComplete='new-password'
                            value={values.re_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.re_password && errors.re_password}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.re_password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button className='w-100' variant='primary' type='submit'>Sign up</Button>
                    </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
          <div className='w-100 text-center mt-2'>
            Already have an account? <Link to={{ pathname: '/login', state: location.state }}>Log in</Link>
          </div>
        </div>
      </Container>
  )
}

export default Signup
