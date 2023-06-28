import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { hashCode } from "../util/hashPassword";

const resetSchema = yup.object({
  password: yup
    .string()
    .required('This field is required'),
  confirmPassword: yup
    .string()
    .required('This field is required'),
});

const Resetpassword = () => {
  const { token } = useParams();
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetSchema,
    onSubmit: (values) => {
      resetPassword(values.password, values.confirmPassword)
    },
});

  const separatorIndex = token.indexOf('-');
  const email = token.slice(0, separatorIndex);
  const checkToken =  token.slice(separatorIndex + 1);

  useEffect(() => {
    fetch(`http://localhost:9999/users?token=${checkToken}`)
      .then(res => res.json())
      .then((resp) => {
        if (Object.keys(resp).length === 0) {
            toast.error('Unauthorized');
            navigate('/login')
        }
      })
  }, [])
  
  const resetPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error('Confirm password does not match');
    } else {
      fetch(`http://localhost:9999/users/${email}`,{
          method: 'PATCH',
          body: JSON.stringify({
            password: hashCode().hash(password),
            token: ''
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      )
      .then(() => {
        toast.success('Reset password successfully');
        navigate('/login')
      })
      .catch(() => toast.error('Something went wrong!'))
    }
  }

  return (
    <>
      <Meta title={"Reset Password"} />
      <BreadCrumb title="Reset Password" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Reset Password</h3>
              <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-15">
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  value={formik.value?.password}
                  errMes={
                      formik.touched.password &&
                      formik.errors.password
                  }
                />
                <CustomInput
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={formik.handleChange('confirmPassword')}
                  onBlur={formik.handleBlur('confirmPassword')}
                  value={formik.value?.confirmPassword}
                  errMes={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                  }
                />
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Resetpassword;
