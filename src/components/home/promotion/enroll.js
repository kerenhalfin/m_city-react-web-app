import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import AttachEmailRoundedIcon from '@mui/icons-material/AttachEmailRounded';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { promotionsCollection } from '../../../firebase';
import { query, where, getDocs, addDoc } from 'firebase/firestore';
import { getUITheme } from '../../utils/tools';

const Enroll = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {email: ''},
        validationSchema: Yup.object({
            email: Yup.string()
                    .email('Invalid email')
                    .required('The email is required')
        }),
        onSubmit: (values, {resetForm}) => {
            setLoading(true);
            submitForm(values);
        }
    });

    const submitForm = async(values) => {
        try {
            const q = query(
                promotionsCollection, 
                where('email', '==', values.email)
            );
            const results = await getDocs(q);
            let msg = '';

            if (results && results.docs && results.docs.length) {
                msg = 'Sorry you are already on the list';
            } else {
                await addDoc(promotionsCollection, { email: values.email });
                msg = 'Congratulations';
                formik.resetForm();
            }
            
            setLoading(false);
            console.log(msg);

        } catch (err) {

        }
    }

    return (
        <Fade>
            <div className="enroll_wrapper">
                <form onSubmit={formik.handleSubmit}>
                    <div className="enroll_title">
                        Enter your email
                    </div>
                    <div className="enroll_input">
                        <input 
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>

                    {
                        formik.touched.email && formik.errors.email ?
                        <div className="error_label">
                            {formik.errors.email}
                        </div>
                        : null 
                    }

                    <LoadingButton
                        type="submit"
                        theme={getUITheme()}
                        color="primary" 
                        endIcon={<AttachEmailRoundedIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        Enroll
                    </LoadingButton>

                    <div className="enroll_discl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </form>
            </div>
        </Fade>
    )
}

export default Enroll;