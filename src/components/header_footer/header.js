import React from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { ThemeProvider } from '@mui/material/styles';
import KeyboardTabRoundedIcon from '@mui/icons-material/KeyboardTabRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { CityLogo } from '../utils/tools';
import { getUITheme, scrollToTop, logoutHandler } from '../utils/tools';

const Header = ({user}) => {
   
    const getUserNameFromEmail = () => {
        let userName = '';

        if (user && user.email && (user.email !== '')) {
            const indexOfEmail = user.email.indexOf('@');
            userName = user.email.substr(0, indexOfEmail);
        }

        return userName;
    }
    
    return (
        <AppBar 
            position="fixed" 
            style={{
                backgroundColor: '#98c5e9',
                padding: '10px 0',
                boxShadow: '0px 3px 1px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
            }}>
            <Toolbar style={{ display: 'flex' }}>
                <div>
                    <div className="header_logo">
                        <CityLogo
                            link={true}
                            linkTo={'/'}
                            width='70px'
                            height='70px'/>
                        
                    </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                    <Link to='/' className="link_logo">
                        <Button className="home_menu_link" color="inherit" onClick={scrollToTop}>Home</Button>
                    </Link>
                </div>

                { !user ?
                    <Link to='/sign_in'>
                        <ThemeProvider theme={getUITheme()}>
                            <Button className="top_menu_link" color="primary" variant="contained" onClick={scrollToTop}
                                endIcon={<KeyboardTabRoundedIcon />}>
                                Sign in
                            </Button>
                        </ThemeProvider>
                    </Link>
                 : 
                    <>
                        <div className="username_label">
                            <span className="username_label_txt">
                                {`Hello, ${getUserNameFromEmail()}`} 
                            </span>
                            <AccountCircleIcon className="username_label_icon" fontSize="small"/>
                        </div>

                        <Link to='/dashboard'>
                            <Button className="top_menu_link" color="inherit" onClick={scrollToTop}>Dashboard</Button>
                        </Link>
                    </>
                }
                
                <Link to='/the_team'>
                    <Button className="top_menu_link" color="inherit" onClick={scrollToTop}>The team</Button>
                </Link>
                <Link to='/the_matches'>
                    <Button className="top_menu_link" color="inherit" onClick={scrollToTop}>Matches</Button>
                </Link>

                { user ?
                    <Button className="top_menu_link" color="inherit" variant="outlined" onClick={() => logoutHandler()}
                    endIcon={<LockOpenRoundedIcon />}>
                        Log out
                    </Button>
                 : null
                }
            </Toolbar>
        </AppBar>
    )
}

export default Header;