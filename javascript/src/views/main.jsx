import React from 'react';
import About from './components/About';

class Main extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="main">
          <div className="content">
            <p>
              TRAVEL THE WORLD. SAFE
            </p>
            <ul className="mobile">
              <li>TRACKER portal</li>
              <li>About Tracker</li>
              <li>API</li>
            </ul>
          </div>
        </div>
        <About />
      </div>
    );
  }
}

export default Main;