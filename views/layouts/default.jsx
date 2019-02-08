import React from 'react';
import Navigation from '../components/Navigation';

class DefaultLayout extends React.Component {
   render() {
    return (
      <html>
        <head>
            <title>{this.props.title}</title>
            <link rel="stylesheet" type="text/css" href="/stylesheets/master.css" />
            <link rel="icon" type="image/png" href="https://cdn.iconscout.com/icon/free/png-256/map-location-pin-security-shield-place-navigation-2-10955.png" />
        </head>
        <body>
          <Navigation />
          <div className="container">
            {this.props.children}
          </div>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;