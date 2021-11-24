import React from 'react';
import { createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signOut } from "firebase/auth";
import { FormHelperText } from '@material-ui/core';
import { app } from '../../firebase';
import mcitylogo from '../../resources/images/logos/manchester_city_logo.png';

let uiTheme = null;

export const getUITheme = () => {
    if (!uiTheme) {
        uiTheme = createTheme({
            palette: {
                primary: {
                    main: '#4d73a3'
                }
            }
        });
    }

    return uiTheme;
};

export const scrollToTop = () => {
    window.scrollTo(0, 0);
}

export const CityLogo = (props) => {
    const template =
    <div 
        className="img_cover"
        onClick={scrollToTop}
        style={{
            width: props.width,
            height: props.height,
            background: `url(${mcitylogo}) no-repeat`
        }}>
    </div>

    if (props.link) {
        return (
            <Link
                className="link_logo" to={props.linkTo} >
                {template}
            </Link>
        )
    } else {
        return template;
    }
}

export const Tag = (props) => {
    const TEMPLATE = <div
    className={`titleTag ${props.className}`}
    style={{
        background: props.bck ? props.bck : '#fff',
        fontSize: props.size ? props.size : '15px',
        color: props.color ? props.color : '#000',
        ...props.add
    }}>
        {props.children}
    </div>;

    if (props.link) {
        return (
            <Link to={props.linkTo}>
                {TEMPLATE}
            </Link>
        )
    } else {
        return TEMPLATE;
    }
}

export const showToastError = (msg) => {
    toast.error(msg,{
        position: toast.POSITION.TOP_LEFT
    })
}

export const showToastSuccess = (msg) => {
    toast.success(msg,{
        position: toast.POSITION.TOP_LEFT
    })
}

export const logoutHandler = (props) => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
        showToastSuccess('Signed out');
    }).catch((error) => {
            showToastError(error);
        }
    );
}

export const textErrorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values],
    helperText: (formik.errors[values] && formik.touched[values]) ? formik.errors[values] : null
})

export const selectErrorHelper = (formik, values) => {
    if (formik.errors[values] && formik.touched[values]) {
        return (<FormHelperText>{formik.errors[values]}</FormHelperText>);
    }
    return false;
}

export const selectIsError = (formik, values) => {
    return (formik.errors[values] && formik.touched[values]);
}