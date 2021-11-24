import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header_footer/header';
import Footer from './components/header_footer/footer';
import Home from './components/home';
import SignIn from './components/sign_in';
import TheTeam from './components/the_team';
import TheMatches from './components/the_matches';
import Dashboard from './components/admin/dashboard';
import AuthGuard from './hoc/auth';
import AdminPlayers from './components/admin/players';
import AddEditPlayers from './components/admin/players/addEditPlayers';
import AdminMatches from './components/admin/matches/index';
import AddEditMatch from './components/admin/matches/addEditMatch';
import NotFound from './components/not_found';

const Routes = ({user}) => {

  return (
    <BrowserRouter>
      <Header user={user}/>

      <Switch>
        <Route path='/admin_matches/edit_match/:matchid' component={AuthGuard(AddEditMatch)}/>
        <Route path='/admin_matches/add_match' component={AuthGuard(AddEditMatch)}/>
        <Route path='/admin_matches' component={AuthGuard(AdminMatches)}/>

        <Route path='/admin_players/edit_player/:playerid' component={AuthGuard(AddEditPlayers)}/>
        <Route path='/admin_players/add_player' component={AuthGuard(AddEditPlayers)}/>
        <Route path='/admin_players' component={AuthGuard(AdminPlayers)}/>

        <Route path='/dashboard' component={AuthGuard(Dashboard)}/>
        <Route path='/the_matches' component={TheMatches}/>
        <Route path='/the_team' component={TheTeam}/>
        <Route path='/sign_in' component={
          (props) => (
            <SignIn {...props} user={user}/>
          )
        }/>
        <Route path="/" exact component={Home}/>
        <Route component={NotFound}/>
        
      </Switch>

      <ToastContainer />

      <Footer/>

    </BrowserRouter>
  );
}

export default Routes;
