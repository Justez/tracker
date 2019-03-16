import React from 'react';
import { connect } from 'react-redux';
import * as paths from './utils/routes/paths'
import { endSessionAction } from './redux/actions/sessionActions'
import Main from './views/Main';
import About from './views/About';
import Api from './views/Api';
import Contact from './views/Contact';
import Error from './views/Error';
import Navigation from './views/layouts/Navigation';
import Dashboard from './views/Dashboard';
import Footer from './views/layouts/Footer';
import Register from './views/Register';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  componentDidMount() {
    let today = (new Date()).toJSON().substring(0, 10).replace('-0', '-');
    if (this.props.active && this.props.expiry !== today) {
      this.props.endSession();
    }
    
    const main = document.getElementsByTagName('main')[0];
    main.addEventListener('click', () => document.getElementsByClassName('menu')[0].classList.remove("active"));
  }

  view = () => {
    return (
      <main>
        <BrowserRouter>
          <Switch>
            <Route exact path={paths.homePath} component={Main}/>
            <Route path={paths.aboutPath} component={About}/>
            <Route path={paths.apiPath} component={Api}/>
            <Route path={paths.dashboardPath} component={Dashboard}/>
            <Route path={paths.registerPath} component={Register}/>
            <Route path={paths.contactPath} component={Contact}/>
            <Route component={Error}/>
          </Switch>
        </BrowserRouter>
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

function mapStateToProps({ session: { email, active, expiry, loading }}) {
  return { email, active, expiry };
}

const mapDispatchToProps = (dispatch) => ({
  endSession: (val) => dispatch(endSessionAction(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);