import React, { useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as loaderActions } from '../store/slices/loaderSlice.js';
import routes from '../api/routes.js';
import getAuthToken from '../utils/getAuthToken.js';
import fetchCurrentChats from '../store/middlewares.js';
import authContext from '../contexts/authContext.js';
import CustomSpinner from './CustomSpinner.jsx';
import MainWindow from '../pages/MainWindow.jsx';

const Loader = ({ notify }) => {
  const navigate = useNavigate();
  const loaderStatus = useSelector((state) => state.loaderReducer.status);
  const { logOut } = useContext(authContext);
  const dispatch = useDispatch();
  const { idInstance, apiTokenInstance } = getAuthToken();

  const showError = useCallback((e) => {
    notify(e);
  }, [notify]);

  const processError = useCallback((errMessage) => {
    showError(errMessage);
    dispatch(loaderActions.resetState());
    logOut();
    navigate('/login');
    console.log(errMessage);
  }, [logOut, showError, navigate, dispatch]);

  useEffect(() => {
    if (loaderStatus === 'ERROR') {
      processError('NetworkError');
    }
    dispatch(fetchCurrentChats(routes.getContactsPath(idInstance, apiTokenInstance)));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loaderStatus === 'LOADING' && (<CustomSpinner />)}
      {loaderStatus === 'LOADED' && <MainWindow notify={notify} processError={processError} />}
    </>
  );
};

export default Loader;
