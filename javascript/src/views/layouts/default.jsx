import React from 'react';
import Navigation from './Navigation';

class DefaultLayout extends React.Component {
   render() {
    return (
      <div>
        <Navigation />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DefaultLayout;