import React from 'react';
import DefaultLayout from './layouts/default';

class Index extends React.Component {
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Index</div>
      </DefaultLayout>
    );
  }
}

module.exports = Index;