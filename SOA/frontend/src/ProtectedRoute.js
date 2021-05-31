import { Route, Redirect } from 'react-router-dom'
import { useAuth } from './AuthContext'

function ProtectedRoute({ onUser, redirect, state, component: Component, ...rest }) {
  const { user } = useAuth()
  const protect = onUser ? user : !user // redirect on user or not
  return (
      <Route
          {...rest}
          render={props => {
            return protect ? <Redirect to={{ pathname: redirect, state: (state || props.location.state) }} /> : <Component />
          }}
      />
  )
}

export default ProtectedRoute