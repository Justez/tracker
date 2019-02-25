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
                <h2>DASHBOARD</h2>
                <p>
                    {props.email}
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
