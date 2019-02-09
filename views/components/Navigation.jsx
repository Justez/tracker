import React from 'react';

const Navigation = (props) => 
    <div className="nav">
        <div className="nav-line">
            <div className="logo" tabIndex="0">
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
                <li tabIndex="0">TRACKER portal</li>
                <li tabIndex="0">API</li>
                <li tabIndex="0">About Tracker</li>
                <li tabIndex="0">Contact us</li>
            </ul>
        </div>
    </div>

export default Navigation;