import React, { useState, useContext } from 'react'
import auth from './Auth'

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

  return (
      <AuthContext.Provider value={
        {
          user,
          token,
          login,
          logout
        }
      }>
        {children}
      </AuthContext.Provider>
  )
}
