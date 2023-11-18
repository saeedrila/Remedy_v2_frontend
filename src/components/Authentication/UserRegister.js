import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from 'formik';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
} from 'reactstrap';
import axios from '../../api/axios';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX = /^.{4,23}$/;

const UserRegister = ({ accountType, registerUrl }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      pwd: '',
      matchPwd: '',
    },
    onSubmit: async (values) => {
      try {
        const { email, pwd, matchPwd } = values;
        const isValidPwd = PWD_REGEX.test(pwd) && PWD_REGEX.test(matchPwd);
        if (!isValidPwd || pwd !== matchPwd) {
          toast.error('Passwords are not valid or do not match');
          return;
        }

        await axios.post(registerUrl, {
          email,
          password: pwd,
          account_type: accountType,
        });

        toast.success('Account created successfully');
        formik.resetForm();
        navigate('/login');
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.error('An unexpected error occurred');
          }
        } else {
          toast.error('No Server Response');
        }
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!EMAIL_REGEX.test(values.email)) {
        errors.email = 'Invalid email format';
      }

      if (!values.pwd) {
        errors.pwd = 'Password is required';
      } else if (!PWD_REGEX.test(values.pwd)) {
        errors.pwd = 'Password must be at least 4 characters';
      }

      if (!values.matchPwd) {
        errors.matchPwd = 'Confirm Password is required';
      } else if (values.pwd !== values.matchPwd) {
        errors.matchPwd = 'Passwords do not match';
      }

      return errors;
    },
  });

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col>
                      <div className="text-primary p-4">
                        <h3 className="text-primary  text-center">
                          Register as a {accountType}
                        </h3>
                        <p className="text-center">Register now!</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={formik.handleSubmit}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          autoComplete="off"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          invalid={formik.touched.email && !!formik.errors.email}
                        />
                        {formik.touched.email && (
                          <div className="invalid-feedback">
                            {formik.errors.email}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="pwd"
                          type="password"
                          placeholder="Enter Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.pwd}
                          invalid={formik.touched.pwd && !!formik.errors.pwd}
                        />
                        {formik.touched.pwd && (
                          <div className="invalid-feedback">
                            {formik.errors.pwd}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="matchPwd"
                          type="password"
                          placeholder="Confirm Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.matchPwd}
                          invalid={formik.touched.matchPwd && !!formik.errors.matchPwd}
                        />
                        {formik.touched.matchPwd && (
                          <div className="invalid-feedback">
                            {formik.errors.matchPwd}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <div className="d-flex justify-content-center">
                  <p
                    className="hand-cursor mx-2"
                    onClick={() => navigate('/register')}
                  >
                    Patient's Register{" "}
                  </p>
                  <p
                    className="hand-cursor mx-2"
                    onClick={() => navigate('/doctor-register')}
                  >
                    Doctor's Register{" "}
                  </p>
                  <p
                    className="hand-cursor mx-2"
                    onClick={() => navigate('/lab-register')}
                  >
                    Lab's Register{" "}
                  </p>
                  <p
                    className="hand-cursor mx-2"
                    onClick={() => navigate('/executive-register')}
                  >
                    Executive's Register{" "}
                  </p>
                </div>
                <p>
                  Have an account ?{" "}
                  <Link to="/login" className="fw-medium text-primary">
                    {" "}
                    Login now{" "}
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()}. Crafted with
                  <i className="mdi mdi-heart text-danger" /> by Remedy
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserRegister;
