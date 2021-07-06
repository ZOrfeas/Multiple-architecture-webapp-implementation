import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Spinner from 'react-bootstrap/Spinner'

function ProtectedRoute({ redirect, state, component: Component, ...rest }) {
  const { isAuth } = useAuth()

  const [protect, setProtect] = useState()
  const [loading, setLoading] = useState(true)

  // check for token validity to decide whether to render component
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await isAuth()
      setProtect(!isAuthenticated)
      setLoading(false)
    }
    checkAuth()
  }, [])

  return (
      loading
          ? <div className='text-center p-5'>
              <Spinner animation='border' variant='secondary' />
            </div>
          : <Route
              {...rest}
              render={props => (
                  protect
                      ? <Redirect to={{ pathname: redirect, state: { ...props.location.state, ...state } }} />
                      : <Component />
              )}
          />
  )
}

export default ProtectedRoute
