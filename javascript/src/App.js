import React from 'react';
import { connect } from 'react-redux';
import * as paths from './utils/routes/paths'
import { endSessionAction } from './redux/actions/sessionActions'
import Main from './views/Main';
import About from './views/About';
import Api from './views/Api';
import Error from './views/Error';
import Navigation from './views/layouts/Navigation';
import Dashboard from './views/Dashboard';
import Footer from './views/layouts/Footer';
import Register from './views/Register';
import { Switch, Route } from 'react-router-dom'

class App extends React.Component {
  componentDidMount() {
    if (this.props.active && this.props.expiry !== (new Date()).toLocaleDateString()) {
      console.log('end session')
      this.props.endSession();
    }
    // proxy test
    // fetch('/accounts/users', {
    //   method: 'GET',
    //   mode: 'cors',
    //   credentials: 'include',
    //   headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    // })
    //   .then(res => res.json())
    //   .then(users => console.log(users))
    
    const main = document.getElementsByTagName('main')[0];
    main.addEventListener('click', () => document.getElementsByClassName('menu')[0].classList.remove("active"));
  }

  view = () => {
    return (
      <main>
        <Switch>
          <Route exact path={paths.homePath} component={Main}/>
          <Route path={paths.aboutPath} component={About}/>
          <Route path={paths.apiPath} component={Api}/>
          <Route path={paths.dashboardPath} component={Dashboard}/>
          <Route path={paths.registerPath} component={Register}/>
          {/* <Route path='/contact-us' component={Contact}/> */}
          <Route component={Error}/>
        </Switch>
      </main>
    );
  }

  render() {
    return (
      <div>
        <Navigation />
        {this.view()}
        <Footer />
      </div>
    );
  }
}

function mapStateToProps({ session: { email, active, expiry }}) {
  return { email, active, expiry };
}

const mapDispatchToProps = (dispatch) => ({
  endSession: (val) => dispatch(endSessionAction(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);