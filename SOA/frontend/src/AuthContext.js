import React, { useState, useEffect, useContext } from 'react'
import auth from './Auth/Auth'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.getUser())
  console.log(user)

  // useEffect(() => {})

  function login({ user, token }) {
    auth.login({ user, token })
    setUser(user)
  }

  return (
      <AuthContext.Provider value={
        {
          user,
          login
        }
      }>
        {children}
      </AuthContext.Provider>
  )
}
