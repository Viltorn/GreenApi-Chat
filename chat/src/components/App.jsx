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
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
// import routes from '../routes';
import LoginForm from './LoginForm.jsx';
import ErrorPage from './error-page.jsx';
import Header from './Header.jsx';
import authContext from '../contexts/authContext.js';
import MainWindow from './MainWindow.jsx';

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
            <MainWindow notify={notify} />
          </PrivateRoute>
            )}
      />
      <Route path="/login" element={<LoginForm notify={notify} />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
