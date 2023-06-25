import React, {
  useEffect,
  useContext,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import 'bootstrap';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import logo from '../assets/ChatLogo.png';
import authContext from '../contexts/authContext.js';

const LoginForm = ({ notify }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const navigate = useNavigate();
  const { logIn } = useContext(authContext);
  const [authFailed, setAuthFailed] = useState(false);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      idInstance: '1101829929',
      apiTokenInstance: '5e57d6a36b9e43e4b3957b0188147636ad40cf798c0345b386',
    },
    onSubmit: async ({ idInstance, apiTokenInstance }) => {
      setAuthFailed(false);

      try {
        const res = await axios.get([
          `${routes.basePath()}${idInstance}`,
          'getStateInstance',
          `${apiTokenInstance}`,
        ].join('/'));
        if (res.status === 200) {
          const userStatus = res.data.stateInstance;
          if (userStatus === 'authorized') {
            logIn({ idInstance, apiTokenInstance });
            const { from } = { from: { pathname: '/' } };
            navigate(from);
          } else {
            formik.setSubmitting(false);
            setAuthFailed(true);
            inputEl.current.select();
            notify('notAuthorizedError');
          }
        }
      } catch (err) {
        formik.setSubmitting(false);
        setAuthFailed(true);
        inputEl.current.select();
        notify('authOrNetError');
        console.log(err);
      }
    },
    validateOnChange: false,
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={logo} className="rounded-circle img-fluid" style={{ height: '200px', width: '200px' }} alt={t('Enter')} />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('Enter')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      onChange={formik.handleChange}
                      value={formik.values.idInstance}
                      placeholder="idInstance"
                      name="idInstance"
                      id="idInstance"
                      autoComplete="idInstance"
                      isInvalid={authFailed}
                      required
                      ref={inputEl}
                    />
                    <Form.Label htmlFor="idInstance">{t('idInstance')}</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.apiTokenInstance}
                      placeholder="apiTokenInstance"
                      name="apiTokenInstance"
                      id="apiTokenInstance"
                      autoComplete="apiTokenInstance"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Label htmlFor="apiTokenInstance">{t('apiTokenInstance')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t('errors.LoginError')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100">{t('Enter')}</Button>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
