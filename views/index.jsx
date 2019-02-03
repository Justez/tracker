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
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
              jakhdasdkjandasld
            </div>
          </DefaultLayout>
        </div>
        <About />
      </div>
    );
  }
}

module.exports = Index;