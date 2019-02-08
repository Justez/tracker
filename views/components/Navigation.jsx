import React from 'react';

const Navigation = (props) => 
    <div className="nav">
        <div className="nav-line">
            <div className="logo">
                <img src="/images/mappoint.png" />
                <div>Tracker</div>
            </div>
            <div className="menu-helper">
                <img alt="menu" src="/images/menu.png" />
            </div>
        </div> 
        <div className="links">
            <ul className="menu">
            {/* <ul className="menu active"> */}
                <li>TRACKER portal</li>
                <li>API</li>
                <li>About Tracker</li>
                <li>Contact us</li>
            </ul>
        </div>
    </div>

export default Navigation;