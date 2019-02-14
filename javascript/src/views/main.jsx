import React from 'react';
import { toApi } from '../utils/routes/navigators'
import { registerPath, sourcePath } from '../utils/routes/paths'

class Main extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="main container">
          <div className="content">
            <p>
              TRAVEL THE WORLD. SAFE
            </p>
            <ul className="mobile">
              <li>TRACKER portal</li>
              <li>About Tracker</li>
              <li>API</li>
            </ul>
          </div>
        </div>
        <div className="description container">
          <div className="title">
              PROTECT WHAT'S IMPORTANT TO YOU
          </div>
          <div className="content">
            <div className="details">
              <h2>Simple, everyday and everywhere</h2>
              <p>
                Enjoy trips and vacations with our free to use tracking interface.
                <br />
                Let your family know that you are safe and sound.
                <br />
                View your trip details on map or export data in case of emergency.
                <br />
                <a href={registerPath}>Register</a>
                {' '}
                and start using our services now.
              </p>
              <p>
                Additionally, you can deploy Tracker on your private home-ip server using our 
                <br />
                <a href={sourcePath} target="_blank" rel="noopener noreferrer">open-source solution</a>
                .
              </p>
              <button onClick={toApi} onKeyPress={toApi}>Read our API documentation</button>
            </div>
            <div className="photo">
                <img alt="journey" src="https://image.freepik.com/free-photo/car-travelling-by-sunny-road_1088-51.jpg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;