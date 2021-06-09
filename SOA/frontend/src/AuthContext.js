import React, { useState, useEffect, useContext } from 'react'
import auth from './Auth/Auth'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.getUser())
  const [token, setToken] = useState(auth.getToken())

  // useEffect(() => {})

  function login({ user, token }) {
    auth.login({ user, token })
    setUser(user)
    setToken(token)
  }

  function logout() {
    auth.logout()
  }

  return (
      <AuthContext.Provider value={
        {
          user,
          token,
          login,
          logout,
        }
      }>
        {children}
      </AuthContext.Provider>
  )
}
