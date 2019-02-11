import React from 'react';
import Main from './views/main';
import Navigation from './views/layouts/Navigation';
import Footer from './views/layouts/Footer';

// todo: router between main page, portal if signed in, 
class App extends React.Component {
  componentDidMount() {
    // proxy test
    fetch('/register')
      .then(res => res.json())
      .then(users => console.log(users));
  }

  render() {
    return (
      <div>
        <Navigation />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;