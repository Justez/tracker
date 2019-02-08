import React from 'react';
import DefaultLayout from './layouts/default';
import About from './components/About';

class Index extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="main">
          <DefaultLayout title={this.props.title}>
            <div className="content">
              <p>
                TRAVEL THE WORLD. SAFE. FREE
              </p>
              <button>DISCOVER</button>
              <ul className="mobile">
                <li>TRACKER portal</li>
                <li>About</li>
                <li>API</li>
              </ul>
            </div>
          </DefaultLayout>
        </div>
        <About />
      </div>
    );
  }
}

module.exports = Index;