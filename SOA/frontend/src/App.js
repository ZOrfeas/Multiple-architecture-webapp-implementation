import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { useState, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from "./ProtectedRoute";
import NavComponent from './Nav/Nav';
import Home from './Home/Home';
import Footer from './Footer/Footer';
import Signup from './Auth/Signup';
import QuestionsPerKeyword from './QuestionsPerKeyword/QuestionsPerKeyword';
// import auth from './Auth/Auth'
import Container from 'react-bootstrap/Container';

function App() {
  // const [isAuth, setIsAuth] = useState( false )

  /*useEffect(() => {
    auth.isAuth().then(value => {
      if (isAuth !== value) {
        setIsAuth(value);
      }
    })
  });*/

  return (
      <Router>
        <div className="App">
          <AuthProvider>
            <NavComponent />
            <Container fluid className="content-wrapper">
              <Route path="/" exact component={Home} />
              <ProtectedRoute path="/signup" component={Signup} />
              <Route path="/keywords" component={QuestionsPerKeyword} />
            </Container>
          </AuthProvider>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
