import React from 'react';
import Main from './views/Main';
import About from './views/About';
import Error from './views/Error';
import Navigation from './views/layouts/Navigation';
import Footer from './views/layouts/Footer';
import { Switch, Route } from 'react-router-dom'

class App extends React.Component {
  componentDidMount() {
    // proxy test
    fetch('/register')
      .then(res => res.json())
      .then(users => console.log(users));
  }

  view = () => {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route path='/about' component={About}/>
          {/* <Route path='/api' component={Api}/> */}
          {/* <Route path='/account' component={Dashboard}/> */}
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
        {process.env.NODE_ENV === 'development' && 
          <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
        }
      </div>
    );
  }
}

export default App;