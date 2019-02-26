import React from 'react';
import { connect } from 'react-redux';
import SignInModal from '../components/SignInModal';
import * as navigate from '../../utils/routes/navigators';
import * as path from '../../utils/routes/paths';
import * as pathName from '../../utils/routes/pathNames';

const modifyClass = (e) => {
    const menu = document.getElementsByClassName("menu")[0]
    menu.classList[(menu.classList.length - 1) ? 'remove' : 'add']("active")
};

const openSignIn = () => {
    const modal = document.getElementById("sign-in-modal")
    // modal.classList.add("active")
    modal.style.display = "block";

    modal.addEventListener('click', (e) => {
        if (e.target.id === "sign-in-modal") {
            modal.style.display = "none";
            document.onkeydown = undefined;
        }
    })

    document.onkeydown = function(evt = window.event) {
        if ((("key" in evt) && (evt.key === "Escape" || evt.key === "Esc"))
            || (evt.keyCode === 27)
        ) {
            modal.style.display = "none";
            document.onkeydown = undefined;
        }
    };
}

const Navigation = (props) => 
    <div>
        <div className="nav dark">
            <div className="nav-line">
                <div className="logo" tabIndex="0" onClick={navigate.toHome} onKeyPress={navigate.toHome}>
                    <img alt="logo" src="/images/mappoint.png" />
                    <div>Tracker</div>
                </div>
                <div className="menu-helper" onClick={modifyClass}>
                    <img alt="menu" src="/images/menu.png"/>
                </div>
            </div> 
            <div className="links">
                <ul className="menu">
                    <li 
                        className={path.dashboardPath === window.location.pathname ? 'current' : ''}
                        onClick={props.active ? navigate.toDashboard : openSignIn} 
                        onKeyPress={props.active ? navigate.toDashboard : openSignIn}
                        tabIndex="0"
                    >
                        {pathName.dashboard}
                    </li>
                    <li 
                        className={path.apiPath === window.location.pathname ? 'current' : ''}
                        onClick={navigate.toApi} 
                        onKeyPress={navigate.toApi}
                        tabIndex="0"
                    >
                        {pathName.api}
                    </li>
                    <li 
                        className={path.aboutPath === window.location.pathname ? 'current' : ''}
                        onClick={navigate.toAbout} 
                        onKeyPress={navigate.toAbout}
                        tabIndex="0"
                    >
                        {pathName.about}
                    </li>
                    <li 
                        className={path.contactPath === window.location.pathname ? 'current' : ''}
                        onClick={navigate.toContact} 
                        onKeyPress={navigate.toContact}
                        tabIndex="0"
                    >
                        {pathName.contact}
                    </li>
                </ul>
            </div>
        </div>
        <div id="sign-in-modal" className="modal-overlay">
            <SignInModal />
        </div>
    </div>

function mapStateToProps({ session: { active }}) {
    return { active };
}

export default connect(mapStateToProps)(Navigation);