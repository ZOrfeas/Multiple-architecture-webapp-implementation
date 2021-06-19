import './Nav.css'
import { useAuth } from '../Auth/AuthContext'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'

function NavComponent() {
  const { user, logout } = useAuth()

  // logout
  const handleClick = () => {
    logout()
    window.location.reload()
  }

  return (
      <Navbar className='fixed-top nav' bg='dark' variant='dark' expand='md'>
        <Navbar.Brand href='/'><span className='ama-logo'>AskMeAnything</span></Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='mr-auto' navbarScroll>
          </Nav>
          {user ?
              <Nav>
                <NavDropdown title={user.displayName} id='collasible-nav-dropdown'>
                  <NavDropdown.Item href='/user'>
                    <i className='material-icons-sharp mr-3'>account_circle</i>Account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleClick}>
                    <i className='material-icons-sharp mr-3'>logout</i>Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              :
              <Nav>
                <div className='d-flex'>
                  <Button className='login-btn mr-2' href='/login'>Log In</Button>
                  <Button className='signup-btn' href='/signup'>Sign Up</Button>
                </div>
              </Nav>
          }
        </Navbar.Collapse>
      </Navbar>
  )
}

export default NavComponent
