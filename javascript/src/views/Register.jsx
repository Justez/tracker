import React from 'react';
import {connect} from 'react-redux';
import * as sessionActions from '../redux/actions/sessionActions';
import {bindActionCreators} from 'redux';

const Register = (props) => (
    <div className="register container">
        <div className="title">
            intro
        </div>
        <div className="content">
            <div className="details">
                <h2>REGISTER FORM</h2>
                {props.email}
            </div>
        </div>
        
    </div>
)

function mapStateToProps({ session: { email }}) {
    return { email };
}

function mapDispatchToProps(dispatch) {
    return {
        sessionActions: bindActionCreators(sessionActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
