import React from 'react';
import Navigation from '../components/Navigation';

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
            <title>{this.props.title}</title>
            <link rel="stylesheet" type="text/css" href="/stylesheets/main.css" />
            <link rel="stylesheet" type="text/css" href="/stylesheets/nav.css" />
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