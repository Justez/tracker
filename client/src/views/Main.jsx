import React from 'react';
import { toApi } from '../utils/routes/navigators'
import { registerPath, sourcePath } from '../utils/routes/paths'

class Main extends React.Component {
  componentDidMount() {
    const width = document.getElementById('root').clientWidth;
    document.getElementsByClassName('nav')[0].classList.remove("dark")
    if (width > 1000) {
      this.addScrollListener(150);
    } else {
      this.addScrollListener(400, 'scroll-up', 'active');
    }
  }

  addScrollListener = (boundary = 100, className = "nav", classChange = "dark") => {
    document.addEventListener('scroll', () => {
      if (boundary > document.getElementById('description').getBoundingClientRect().top) {
        document.getElementsByClassName(className)[0].classList.add(classChange)
      } else {
        document.getElementsByClassName(className)[0].classList.remove(classChange)
      }
    })
  }

  scrollToDescription = () => document.getElementsByClassName("description")[0].scrollIntoView();
  scrollToTop = () => document.getElementsByClassName("index")[0].scrollIntoView();
  
  render() {
    return (
      <div className="index">
        <div className="main container">
          <div className="content">
            <p>
              TRAVEL THE WORLD. SAFE
            </p>
            <ul className="mobile">
              <li onClick={this.scrollToDescription}>
                DISCOVER
              </li>
            </ul>
          </div>
        </div>
        <div className="description container" id="description">
          <div className="title">
              PROTECT WHAT'S IMPORTANT TO YOU
          </div>
          <div className="content">
            <div className="details">
              <h2>Simple, everyday and everywhere</h2>
              <p>
                Enjoy trips and vacations with our free to use tracking interface.
                <br />
                Let your family know you are safe and sound.
                <br />
                View your trip details on map or export data in case of emergency.
                <br />
                <a href={registerPath}>Register</a>
                {' '}
                and start using our services now.
              </p>
              <p>
                Additionally, you can deploy Tracker on your private home server using our 
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
        <button 
          className="scroll-up"
          onClick={this.scrollToTop}
          onKeyPress={this.scrollToTop}
          title="Go to top" 
        >
          Up
        </button> 
      </div>
    );
  }
}

export default Main;