import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Public from './Public/Public'
import Signup from './Auth/Signup'
import Login from './Auth/Login'
import Questions from './Questions/Questions'

function App() {
  return (
      <Router>
        <div className='App'>
          <AuthProvider>
            <Switch>
              <ProtectedRoute path='/signup' onUser redirect='/' component={Signup} />
              <ProtectedRoute path='/login' onUser redirect='/' component={Login} />
              <ProtectedRoute
                  path='/questions'
                  redirect='/login'
                  state={{ alert: true }}
                  component={Questions}
              />
              <Route path='/' component={Public} />
            </Switch>
          </AuthProvider>
        </div>
      </Router>
  )
}

export default App
