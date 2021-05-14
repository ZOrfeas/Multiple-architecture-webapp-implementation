import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import NavBar from "./Nav";
import Home from "./Home";
import Footer from "./Footer";
import QuestionsPerKeyword from "./QuestionsPerKeywords/QuestionsPerKeyword";

function App() {
  return (
      <Router>
        <div className="App">
          <NavBar />
          <Container fluid className="content-wrapper">
            <Route path="/" exact component={Home}/>
            <Route path="/keywords" component={QuestionsPerKeyword}/>
          </Container>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
