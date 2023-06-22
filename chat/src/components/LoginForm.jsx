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
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        if (res.status === 200) {
          logIn(res.data);
          const { from } = { from: { pathname: '/' } };
          navigate(from);
        }
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputEl.current.select();
          return;
        }
        notify('error');
        console.log(err);
        throw Error('NetworkError');
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
                      value={formik.values.username}
                      placeholder="username"
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={authFailed}
                      required
                      ref={inputEl}
                    />
                    <Form.Label htmlFor="username">{t('Nickname')}</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Label htmlFor="password">{t('Password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t('errors.LoginError')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100">{t('Enter')}</Button>
                </fieldset>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('AskForAccount')}
                </span>
                  &nbsp;
                <a href="/signup">
                  {t('Registration')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
