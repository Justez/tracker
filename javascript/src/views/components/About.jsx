import React from 'react';

const About = (props) => (
    <div className="about container">
        <div className="title">
            PROTECT WHAT'S IMPORTANT TO YOU
        </div>
        <div className="content">
            <div className="description">
                <h2>Simple, everyday and everywhere</h2>
                <p>
                    Enjoy trips and vacations with our free to use tracking interface.
                    <br />
                    Let your family know that you are safe and sound.
                    <br />
                    View your trip details on map or export data in case of emergency.
                    <br />
                    <a href="/register" >Register</a>
                    {' '}
                    and start using our services now.
                </p>
                <p>
                    Additionally, you can deploy Tracker on your private home-ip server using our 
                    <br />
                    <a href="https://www.github.com/justez/tracker" target="_blank" rel="noopener noreferrer">open-source solution</a>
                    .
                </p>
                <button>Read our API documentation</button>
            </div>
            <div className="photo">
                <img alt="journey" src="https://image.freepik.com/free-photo/car-travelling-by-sunny-road_1088-51.jpg" />
            </div>
        </div>
        
    </div>
)

export default About