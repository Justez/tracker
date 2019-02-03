import React from 'react';

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
            <title>{this.props.title}</title>
            <link rel="stylesheet" type="text/css" href="/stylesheets/main.css" />
        </head>
        <body>{this.props.children}</body>
      </html>
    );
  }
}

module.exports = DefaultLayout;