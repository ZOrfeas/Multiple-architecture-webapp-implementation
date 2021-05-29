import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ component: Component, ...rest }) {
  const { user } = useAuth();
  return (
      <Route
          {...rest}
          render={() => {
            return user ? <Redirect to='/' /> : <Component />
          }}
      />
  );
}

export default ProtectedRoute;
