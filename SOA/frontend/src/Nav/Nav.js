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
      <Navbar className='fixed-top' bg='dark' variant='dark'>
        <Navbar.Brand href='/'><span className='ama-logo'>AskMeAnything</span></Navbar.Brand>
        <Nav className='mr-auto'>
        </Nav>
          {user ?
              <Nav>
                <NavDropdown title={user.displayName} id='collasible-nav-dropdown'>
                  <NavDropdown.Item href='#'>
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
                <Button className='mr-2' variant='outline-primary' href='/login'>Log In</Button>
                <Button variant='primary' href='/signup'>Sign Up</Button>
              </Nav>
          }
      </Navbar>
  )
}

export default NavComponent
