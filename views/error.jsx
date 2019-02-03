import React from 'react';
import DefaultLayout from './layouts/default';

class HelloMessage extends React.Component {
    componentDidUpdate() {
        console.log(this.props);
    }

    render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Error</div>
      </DefaultLayout>
    );
  }
}

module.exports = HelloMessage;