import React from 'react';
import ReactDOM from 'react-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from './firebase';
import './resources/css/app.css';
import Routes from './routes';

const App = (props) => {
  return (
    <Routes {...props}/>
  )
}

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {

  ReactDOM.render(
    <App user={user}/>, 
    document.getElementById('root')
  );
})