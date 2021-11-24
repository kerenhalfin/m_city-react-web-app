import React, { useState } from 'react';
import { app } from '../../firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import KeyboardTabRoundedIcon from '@mui/icons-material/KeyboardTabRounded';
import LoadingButton from '@mui/lab/LoadingButton';
import { Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showToastError, showToastSuccess, getUITheme } from '../utils/tools';
import mcitylogo from '../../resources/images/logos/manchester_city_logo.png';

const SignIn = (props) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: 'admin@mcity.com',
            password: 'abc123'
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email adress').required('The email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: (value) => {
            setLoading(true);
            submitForm(value);
        }
    });

    const submitForm = (value) => {
        const auth = getAuth(app);

        signInWithEmailAndPassword(auth, 
            value.email,
            value.password)
        .then(() => {
            showToastSuccess('Logged in');
            props.history.push('/dashboard');
        }).catch(error => {
            showToastError(error);
            setLoading(false);
        });
    };

    return (
        <>
            { !props.user ? 
                <div className="containter">
                    <div className="signin_wrapper" style={{ margin: '100px' }}>
                        <form onSubmit={formik.handleSubmit}>
                            <div 
                                className="img_cover login_img"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    background: `url(${mcitylogo}) no-repeat`
                                }}>
                            </div>
                            <h2>Welcome, please login</h2>
                            <input 
                                name="email"
                                placeholder="Email"
                                disabled={true}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}/>
                            {
                                formik.touched.email && formik.errors.email ? 
                                <div className="error_label">
                                    {formik.errors.email}
                                </div>
                                : null
                            }
                            <input 
                                name="password"
                                type="password"
                                placeholder="Password"
                                disabled={true}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}/>
                            {
                                formik.touched.password && formik.errors.password ? 
                                <div className="error_label">
                                    {formik.errors.password}
                                </div>
                                : null
                            }

                            <p>
                                Use the admin user for the demo :)
                            </p>

                            <LoadingButton
                                className="progress"
                                type="submit"
                                theme={getUITheme()}
                                color="primary" 
                                endIcon={<KeyboardTabRoundedIcon />}
                                loading={loading}
                                loadingPosition="end"
                                variant="contained"
                            >
                                Login
                            </LoadingButton>

                        </form>
                    </div>
                </div>

                : <Redirect to={"/dashboard"}/>
            }
        </>
    )
}

export default SignIn;