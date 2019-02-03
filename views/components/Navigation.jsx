import React from 'react';

const Navigation = (props) => 
    <div className="nav">
        <div className="nav-line">
            <div className="logo">
            <img src="/images/mappoint.png" />
            <div>Tracker</div>
            </div>
            <div className="menu-helper"><img alt="menu" src="/images/menu.png" /></div>
        </div> 
        <div className="links">
            <ul className="menu">
            <li>API</li>
            <li>Sign up / Sign in</li>
            <li>About tracker</li>
            <li>
                <img alt="git" src="/images/git.jpg" />
            </li>
            </ul>
        </div>
    </div>

export default Navigation;