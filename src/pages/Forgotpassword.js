import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import CustomInput from '../components/CustomInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

const forgotSchema = yup.object({
    user_email: yup
        .string()
        .email('Please enter a valid email')
        .required('This field is required'),
});

const Forgotpassword = () => {
    const formik = useFormik({
        initialValues: {
            user_email: '',
        },
        validationSchema: forgotSchema,
        onSubmit: (values, { resetForm }) => {
            sendEmail(values.user_email, 'hello', resetForm);
        },
    });

    const sendEmail = (user_email, message, resetForm) => {
        fetch(`http://localhost:9999/users/${user_email}`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                if (Object.keys(resp).length === 0) {
                    toast.error('Please enter valid email');
                } else {
                    const token = crypto.randomUUID();

                    emailjs
                        .send(
                            'service_2xekwl1',
                            'template_1ucoe5o',
                            {
                                to_name: resp.name,
                                user_email,
                                message: `http://localhost:3000/reset-password/${user_email}-${token}`,
                            },
                            '9fVcof7gddlDPABit'
                        )
                        .then(
                            (result) => {
                                console.log(result);
                                resetForm();
                                formik.setValues({ user_email: '' });

                                fetch(`http://localhost:9999/users/${user_email}`,{
                                    method: 'PATCH',
                                    body: JSON.stringify({
                                        token,
                                    }),
                                    headers: {
                                        'Content-type':
                                            'application/json; charset=UTF-8',
                                    },
                                  }
                                );
                                toast.success(
                                    'Send mail successfully. Please check you email to get reset password link!'
                                );
                            },
                            (error) => {
                                console.log(error);
                                toast.error('Cannot send email');
                            }
                        );
                }
            })
            .catch((err) => {
                toast.error('Login failed :' + err.message);
            });
    };

    return (
        <>
            <Meta title={'Forgot Password'} />
            <BreadCrumb title="Forgot Password" />
            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">
                                Reset Your Password
                            </h3>
                            <p className="text-center mt-2 mb-3">
                                We will send you an email to reset your password
                            </p>
                            <form
                                onSubmit={formik.handleSubmit}
                                className="d-flex flex-column gap-15"
                            >
                                <CustomInput
                                    type="text"
                                    name="user_email"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.user_email}
                                    errMes={
                                        formik.touched.user_email &&
                                        formik.errors.user_email
                                    }
                                />

                                <div>
                                    <div className="mt-3 d-flex justify-content-center flex-column gap-15 align-items-center">
                                        <button
                                            className="button border-0"
                                            type="submit"
                                        >
                                            Submit
                                        </button>
                                        <Link to="/login">Back</Link>
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

export default Forgotpassword;
