import './Signup.css'
import React, { useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Formik } from 'formik'
import { loginSchema } from './Schema'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const axios = require('axios')
const url = process.env.REACT_APP_AUTH_URL
// const url = 'http://localhost:3001'

function Login() {
  const [showMsg, setShowMsg] = useState(false)

  const { login } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const alert  = location.state?.alert

  const handleSubmit = values => {
    axios.post(`${url}/signin`, values)
        .then(response => {
          const { user, token } = response.data
          login({ user, token  })
          history.push('/')
        })
        .catch(error => {
          const status = error.response?.status
          if (status === 400 || status === 401 || status === 404) { // user doesn't exists
            setShowMsg(true)
          }
          else {
            console.log(error)
          }
        })
  }

  return (
      <Container className='login-content d-flex align-items-center justify-content-center py-5'>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          <Card className='border-0'>
            <Card.Header className='text-center border-bottom-0 p-4'>
              <a className='ama-logo' href='/'>AskMeAnything</a>
            </Card.Header>
            <Card.Body className='p-4'>
              {alert &&
              <Alert className='mb-5' variant='warning'>
                <div>
                  <p className='text-center mb-0'>You must me logged in to ask a question</p>
                  <p className='text-center mb-0'>Log in or <Link to={{ pathname: '/signup', state: location.state }}>Sign up</Link></p>
                </div>
              </Alert>}
              <Formik
                  initialValues={{
                    username: '',
                    password: ''
                  }}
                  validationSchema={loginSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSubmit(values)
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
                          {showMsg ? 'Email or password is incorrect' : errors.username}
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

                      <Button className='w-100' variant='primary' type='submit'>Log in</Button>
                    </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
          <div className='w-100 text-center mt-2'>
            Don't have an account? <Link to={{ pathname: '/signup', state: location.state }}>Sign up</Link>
          </div>
        </div>
      </Container>
  )
}

export default Login
