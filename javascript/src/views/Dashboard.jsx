import React from 'react';
import {connect} from 'react-redux';
import * as sessionActions from '../redux/actions/sessionActions';
import {bindActionCreators} from 'redux';

const Dashboard = (props) => (
    <div className="dashboard container">
        <div className="title">
            intro
        </div>
        <div className="content">
            <div className="details">
                <h2>section</h2>
                <p>
                    text
                </p>
                <p>
                    text
                    {props.name}
                </p>
            </div>
        </div>
        
    </div>
)

function mapStateToProps({ session: { token, name }}) {
    return { token, name };
}

function mapDispatchToProps(dispatch) {
    return {
        sessionActions: bindActionCreators(sessionActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
