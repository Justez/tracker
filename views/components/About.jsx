import React from 'react';

const About = (props) => (
    <div className="about container">
        <div className="title">
            SECURE WHAT'S IMPORTANT TO YOU
        </div>
        <div className="content">
            <div className="description">
                <h1>PROTECT YOUR VEHICLE</h1>
                <p>
                    Enjoy trips and vacations with our free to use tracking interface.
                    <br />
                    Register and start using our services now.
                </p>
                <p>
                    Or connect your free google drive account using our 
                    {' '}
                    <a href="https://www.github.com/justez/tracker" target="_blank" rel="noopener noreferrer">open-source integration</a>. 

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