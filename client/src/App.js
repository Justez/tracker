import React from 'react';
import { connect } from 'react-redux';
import * as paths from './utils/routes/paths'
import { endSessionAction, registerViewAction } from './redux/actions/sessionActions'
import Main from './views/Main';
import About from './views/About';
import Api from './views/Api';
import Contact from './views/Contact';
// import Error from './views/Error';
import Navigation from './views/layouts/Navigation';
import Dashboard from './views/Dashboard';
import Footer from './views/layouts/Footer';
import Register from './views/Register';

class App extends React.Component {
  componentDidMount() {
    let today = (new Date()).toJSON().substring(0, 10).replace('-0', '-');
    if (this.props.active && this.props.expiry !== today) {
      this.props.endSession();
    }
    
    const main = document.getElementsByTagName('main')[0];
    main.addEventListener('click', () => document.getElementsByClassName('menu')[0].classList.remove("active"));
    this.props.registerView('main');
  }

  view = () => {
    const { view } = this.props;
    return (
      <main>
        {view === paths.homePath && <Main />}
        {view === paths.aboutPath && <About />}
        {view === paths.apiPath && <Api />}
        {view === paths.dashboardPath && <Dashboard />}
        {view === paths.registerPath && <Register />}
        {view === paths.contactPath && <Contact />}
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

function mapStateToProps({ session: { email, active, expiry, view }}) {
  return { email, active, expiry, view };
}

const mapDispatchToProps = (dispatch) => ({
  endSession: (val) => dispatch(endSessionAction(val)),
  registerView: (name) => dispatch(registerViewAction(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);