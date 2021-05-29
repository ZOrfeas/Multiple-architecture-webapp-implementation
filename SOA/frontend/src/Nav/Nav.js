import './Nav.css'
import { useAuth } from '../AuthContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from "react-bootstrap/NavDropdown";

function NavComponent() {
  const { user } = useAuth();
  return (
      <Navbar className="fixed-top" bg="dark" variant="dark">
        <Navbar.Brand href="/">AskMeAnything</Navbar.Brand>
        <Nav className="mr-auto">
        </Nav>
          {user ?
              <Nav>
                <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#">
                    <i className="material-icons-sharp mr-3">account_circle</i>Account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#">
                    <i className="material-icons-sharp mr-3">logout</i>Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              :
              <Nav>
                <Button className="mr-2" variant="outline-primary" href="#">Sign In</Button>
                <Button variant="primary" href="/signup">Sign Up</Button>
              </Nav>
          }
      </Navbar>
  );
}

export default NavComponent;
