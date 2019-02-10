import React from 'react';
import DefaultLayout from './layouts/default';

class ErrorMessage extends React.Component {
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

export default ErrorMessage;