import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavComponent from './Nav/Nav';
import Home from './Home/Home';
import Footer from './Footer/Footer';
import Signup from './Signup/Signup';
import QuestionsPerKeyword from './QuestionsPerKeyword/QuestionsPerKeyword';
import Container from 'react-bootstrap/Container';

function App() {
  return (
      <Router>
        <div className="App">
          <NavComponent />
          <Container fluid className="content-wrapper">
            <Route path="/" exact component={Home}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/keywords" component={QuestionsPerKeyword}/>
          </Container>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
