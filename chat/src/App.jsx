import React, {
  useContext,
} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import LoginForm from './pages/LoginForm.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import authContext from './contexts/authContext.js';

const PrivateRoute = ({ children }) => {
  const { isLogged } = useContext(authContext);
  const location = useLocation();

  return (
    isLogged() ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = ({ notify }) => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route
        path="/"
        element={(
          <PrivateRoute>
            <Loader notify={notify} />
          </PrivateRoute>
            )}
      />
      <Route path="/login" element={<LoginForm notify={notify} />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
