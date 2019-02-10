import React from 'react';
import Main from './views/main';
import Footer from './views/layouts/Footer';

// todo: router between main page, portal if signed in, 

class App extends React.Component {
  componentDidMount() {
    fetch('/register')
      .then(res => res.json())
      .then(users => console.log(users));
  }

  render() {
    return (
      <div>
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;