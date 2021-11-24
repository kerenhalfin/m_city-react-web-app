import React from 'react';
import { Redirect } from 'react-router-dom';
import { app } from '../firebase';
import { getAuth } from "firebase/auth";

const AuthGuard = (Component) => {
    class AuthHOC extends React.Component {

        authCheck = () => {
            const user = getAuth(app).currentUser;

            if (user) {
                return <Component {...this.props}/>;
            } else {
                return <Redirect to="/" />
            }
        }

        render() {
            return this.authCheck();
        }
    }

    return AuthHOC;
};

export default AuthGuard;