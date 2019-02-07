import React, { Component } from 'react';
import './App.css';
import {Route,Switch,withRouter,Redirect} from 'react-router-dom'
import Home from '../HomeContainer/home';
import Login from '../AuthContainer/Login/Login';
import Register from '../AuthContainer/Register/Register';
import 'semantic-ui-css/semantic.min.css'
import {connect} from 'react-redux';
import * as actions from '../../store/index' 
import Spinner from '../../components/ui/spinner/Spinner';
import Logout from '../../containers/AuthContainer/Logout/Logout'

class App extends Component {

  componentDidMount(){
    this.props.onTryAutoSignUp();
  }

  render() {

    let root = (
      <Switch> 
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    )
    
    if(this.props.isAuthenticated) {
      root = (
        <Switch> 
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={Home} />
          <Redirect to="/" />
        </Switch>
      )
    }


    return (
      <div className="App">
        {this.props.loading ?<Spinner /> :root}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated : state.auth.userId !== null,
    loading: state.auth.loading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp : ()=> dispatch(actions.authCheckState())
  }
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
