import React from 'react';
import DefaultLayout from './layouts/default';

class AccountView extends React.Component {
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Register device</div>
      </DefaultLayout>
    );
  }
}

export default AccountView;