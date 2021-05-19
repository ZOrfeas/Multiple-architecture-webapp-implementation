import './Signup.css';
import schema from './Schema'
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const axios = require('axios');
const url = process.env.REACT_APP_AUTH_URL;

function Signup() {
  const handleSubmit = values => {
    console.log(values);
    axios.post(`${url}/signup`, values)
        .then(response => {
          alert(JSON.stringify(response, null, 2));
        })
        .catch(error => {
          console.log(error);
        })
  };

  return (
      <Container className="signup-content py-5">
        <Card>
          <Card.Header as="h4" className="text-center border-bottom-0 py-4">AskMeAnything</Card.Header>
          <Card.Body>
            <Formik
                initialValues={{
                  displayName: '',
                  username: '',
                  password: '',
                  re_password: ''
                }}
                validationSchema={schema}
                onSubmit={({ displayName, username, password }, { setSubmitting }) => {
                  handleSubmit({ displayName, username, password });
                  setSubmitting(false);
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
                    <Form.Group controlId="formGroupDisplayName">
                      <Form.Row className="justify-content-center">
                        <Col xs={7} sm={6} md={4} >
                          <Form.Label>Display name</Form.Label>
                          <Form.Control
                              type="text"
                              name="displayName"
                              value={values.displayName}
                              onChange={handleChange}
                          />
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formGroupUsername">
                      <Form.Row className="justify-content-center">
                        <Col xs={7} sm={6} md={4} >
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                              type="email"
                              name="username"
                              autoComplete="username"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.username && errors.username}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                      <Form.Row className="justify-content-center">
                        <Col xs={7} sm={6} md={4} >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                              type="password"
                              name="password"
                              autoComplete="new-password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.password && errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formGroupRePassword">
                      <Form.Row className="justify-content-center">
                        <Col xs={7} sm={6} md={4} >
                          <Form.Label>Retype password</Form.Label>
                          <Form.Control
                              type="password"
                              name="re_password"
                              autoComplete="new-password"
                              value={values.re_password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.re_password && errors.re_password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.re_password}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Row className="text-right justify-content-center">
                      <Col xs={7} sm={6} md={4} >
                        <Button variant="primary" type="submit">Sign up</Button>
                      </Col>
                    </Form.Row>
                  </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
  );
}

export default Signup;
