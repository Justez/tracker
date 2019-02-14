import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sessionActions from '../../redux/actions/sessionActions';
// import * as navigate from '../../utils/routes/navigators'
// import * as pathName from '../../utils/routes/pathNames'
// navigate.toDashboard

const SignInModal = () => 
    <div>
        <form>
            <p>
                Login to Tracker Portal
            </p>
            <button>Sign In</button>
            <button>Sign Up</button>
            <div id="signin" class="option">
                <p>signin form.</p>
            </div>

            <div id="signup" class="option" style={{ display: 'none' }}>
                <p>signup form.</p>
            </div>
        </form>
    </div>

function mapStateToProps({ session: { id, active }}) {
    return { active, id };
  }

function mapDispatchToProps(dispatch) {
    return {
        session: bindActionCreators(sessionActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInModal);