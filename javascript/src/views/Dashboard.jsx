import React from 'react';
import { connect } from 'react-redux';
import { endSessionAction } from '../redux/actions/sessionActions';

const Dashboard = (props) => {
    if (props.active) {
        return (
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
                    <button onClick={() => props.endSession()}>Sign out</button>
                </div>
            </div>
        )
    }
    return <div className="dashboard container">
        <div className="title">
            Redirecting back to home... 
        </div>
    </div> 
}

function mapStateToProps({ session: { email, active }}) {
    return { email, active };
}

const mapDispatchToProps = (dispatch) => ({
    endSession: () => {
        dispatch(endSessionAction())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
