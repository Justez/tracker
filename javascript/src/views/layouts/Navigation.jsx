import React from 'react';

const addClass = (e) => {
    e.preventDefault();
    document.getElementsByClassName("menu")[0].classList.add("active")
}

const Navigation = () => 
    <div className="nav">
        <div className="nav-line">
            <div className="logo" tabIndex="0">
                <img alt="logo" src="/images/mappoint.png" />
                <div>Tracker</div>
            </div>
            <div className="menu-helper" onClick={addClass}>
                <img alt="menu" src="/images/menu.png"/>
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