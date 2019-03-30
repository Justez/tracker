import React from 'react';
import { connect } from 'react-redux';
import { endSessionAction, registerViewAction } from '../../redux/actions/sessionActions';
import SignInModal from '../components/SignInModal';
import * as path from '../../utils/routes/paths';
import * as pathName from '../../utils/routes/pathNames';

const modifyClass = (e) => {
    const menu = document.getElementsByClassName("menu")[0]
    menu.classList[(menu.classList.length - 1) ? 'remove' : 'add']("active")
};

const openSignIn = () => {
    const modal = document.getElementById("sign-in-modal")
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

const Navigation = (props) => {
    const { registerView } = props;
    return (
        <div>
            <div className="nav dark">
                <div className="nav-line">
                    <div className="logo" tabIndex="0" onClick={() => registerView(path.homePath)} onKeyPress={() => registerView(path.homePath)}>
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
                            onClick={props.active ? () => registerView(path.dashboardPath) : openSignIn} 
                            onKeyPress={props.active ? () => registerView(path.dashboardPath) : openSignIn}
                            tabIndex="0"
                        >
                            {pathName.dashboard}
                        </li>
                        <li 
                            className={path.apiPath === window.location.pathname ? 'current' : ''}
                            onClick={() => registerView(path.apiPath)} 
                            onKeyPress={() => registerView(path.apiPath)}
                            tabIndex="0"
                        >
                            {pathName.api}
                        </li>
                        <li 
                            className={path.aboutPath === window.location.pathname ? 'current' : ''}
                            onClick={() => registerView(path.aboutPath)} 
                            onKeyPress={() => registerView(path.aboutPath)}
                            tabIndex="0"
                        >
                            {pathName.about}
                        </li>
                        <li 
                            className={path.contactPath === window.location.pathname ? 'current' : ''}
                            onClick={() => registerView(path.contactPath)} 
                            onKeyPress={() => registerView(path.contactPath)}
                            tabIndex="0"
                        >
                            {pathName.contact}
                        </li>
                        {props.active &&
                            <li 
                                onClick={props.endSession} 
                                onKeyPress={props.endSession}
                                tabIndex="0"
                            >
                                Sign out
                            </li>
                        }  
                    </ul>
                </div>
            </div>
            <div id="sign-in-modal" className="modal-overlay">
                <SignInModal />
            </div>
        </div>
    )
}

function mapStateToProps({ session: { active }}) {
    return { active };
}

const mapDispatchToProps = (dispatch) => ({
    endSession: () => dispatch(endSessionAction()),
    registerView: (name) => dispatch(registerViewAction(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);