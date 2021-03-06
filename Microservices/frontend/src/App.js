import './App.css'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './Auth/AuthContext'
import auth from './Auth/Auth'
import ProtectedRoute from './Auth/ProtectedRoute'
import Public from './Public/Public'
import Signup from './Auth/Signup'
import Login from './Auth/Login'
import QuestionsRoute from './Questions/QuestionsRoute'
import User from './User/User'

function App() {
  // add event listener to log out from all tabs
  useEffect(() => {
    window.addEventListener('storage', auth.logoutAllTabs)
    return function cleanup() {
      window.removeEventListener('storage', auth.logoutAllTabs)
    }
  }, [])

  return (
      <Router>
        <div className='App'>
          <AuthProvider>
            <Switch>
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <ProtectedRoute
                  exact
                  path='/questions'
                  redirect='/public-questions'
                  component={QuestionsRoute}
              />
              <ProtectedRoute
                  path='/questions'
                  redirect='/login'
                  state={{ alert: true }}
                  component={QuestionsRoute}
              />
              <ProtectedRoute
                  path='/user'
                  redirect='/login'
                  state={{ alert: true }}
                  component={User}
              />
              <Route path='/' component={Public} />
            </Switch>
          </AuthProvider>
        </div>
      </Router>
  )
}

export default App
