import './Nav.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

function NavComponent() {
  return (
      <Navbar className="fixed-top" bg="dark" variant="dark">
        <Navbar.Brand href="/">AskMeAnything</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>
        <Button className="mr-2" variant="outline-primary">Sign In</Button>
        <Button variant="primary" href="/signup">Sign Up</Button>
      </Navbar>
  );
}

export default NavComponent;
