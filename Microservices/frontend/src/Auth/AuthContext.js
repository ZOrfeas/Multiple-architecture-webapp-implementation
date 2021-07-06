import React, { useState, useContext } from 'react'
import auth from './Auth'

/**
 * Context to pass auth functions between components
 */

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.getUser())
  const [token, setToken] = useState(auth.getToken())

  const login = ({ user, token }) => {
    auth.login({ user, token })
    setUser(user)
    setToken(token)
  }

  const logout = () => {
    auth.logout()
  }

  const isAuth = auth.isAuth

  return (
      <AuthContext.Provider value={
        {
          user,
          token,
          isAuth,
          login,
          logout
        }
      }>
        {children}
      </AuthContext.Provider>
  )
}
