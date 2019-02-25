import React from 'react';
import Main from './views/Main';
import About from './views/About';
import Error from './views/Error';
import Navigation from './views/layouts/Navigation';
import Dashboard from './views/Dashboard';
import Footer from './views/layouts/Footer';
import Register from './views/Register';
import { Switch, Route } from 'react-router-dom'

class App extends React.Component {
  componentDidMount() {
    // proxy test
    fetch('/register')
      .then(res => res.json())
      .then(users => console.log(users));
    
    const main = document.getElementsByTagName('main')[0];
    main.addEventListener('click', () => document.getElementsByClassName('menu')[0].classList.remove("active"));
  }

  view = () => {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route path='/about' component={About}/>
          {/* <Route path='/api' component={Api}/> */}
          <Route path='/account' component={Dashboard}/>
          <Route path='/register' component={Register}/>
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

export default App;