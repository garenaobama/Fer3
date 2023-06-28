import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import CustomInput from '../components/CustomInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { hashCode } from '../util/hashPassword';

const loginSchema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('This field is required'),
    password: yup.string().required('This field is required'),
});

const Login = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log(values);
            console.log(values.password);
            login(values.email, values.password);
        },
    });
    
    const login = (email, password) => {
        fetch(`http://localhost:9999/users/${email}`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                console.log(resp);
                if (Object.keys(resp).length === 0) {
                    toast.error('Please enter valid email');
                } else {
                    if (hashCode().verifyCode(password, resp.password)) {
                        toast.success('Successfully logged in');
                        const data = {
                            email: email,
                            role: resp.role,
                            name: resp.name
                        }
                        sessionStorage.setItem('data', JSON.stringify(data));
                        navigate('/');
                    } else {
                        toast.error('Wrong password');
                    }
                }
            })
            .catch((err) => {
                toast.error('Login failed: ' + err.message);
            });
    };

    return (
        <>
            <Meta title={'Login'} />
            <BreadCrumb title="Login" />

            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">Login</h3>
                            <form
                                className="d-flex flex-column gap-15"
                                onSubmit={formik.handleSubmit}
                            >
                                <CustomInput
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={formik.handleChange('email')}
                                    onBlur={formik.handleBlur('email')}
                                    value={formik.value?.email}
                                    errMes={
                                        formik.touched.email &&
                                        formik.errors.email
                                    }
                                />
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
                                <div>
                                    <Link to="/forgot-password">
                                        Forgot Password?
                                    </Link>

                                    <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                                        <button
                                            className="button border-0"
                                            type="submit"
                                        >
                                            Login
                                        </button>
                                        <Link
                                            to="/signup"
                                            className="button signup"
                                        >
                                            Sign Up
                                        </Link>
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

export default Login;
