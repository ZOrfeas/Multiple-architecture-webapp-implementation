import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import NavBar from "./Nav";
import Home from "./Home";
import Footer from "./Footer";
import Keywords from "./Keywords";

function App() {
  return (
      <Router>
        <div className="App">
          <NavBar />
          <Container fluid className="content-wrapper">
            <Route path="/" exact component={Home}/>
            <Route path="/keywords" component={Keywords}/>
          </Container>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
