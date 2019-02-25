import React from 'react';
import {connect} from 'react-redux';
import { startSessionAction } from '../../redux/actions/sessionActions';
import { Field, reduxForm } from 'redux-form';

const InputField = ({ input, label, type, meta: { error, touched }}) => (
    <div className="form-item">
        <label>{label}</label>
        <div className="input-field">
            <input {...input} placeholder={label} type={type} />
            {error && touched && <small>{error}</small>}
        </div>
    </div>
)

const SignInModal = (props) => {
    const { handleSubmit, pristine, invalid, submitting } = props;
    
    const submit = (vals) => {
        if (vals.email && vals.password) {
            props.startSession(vals)
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <p className="header">Login to Tracker portal:</p>
            <hr />            
            <div className="content">
                <Field
                    component={InputField}
                    label="Email:"
                    name="email"
                    type="email"
                    placeholder="Email"
                />
                <Field
                    component={InputField}
                    label="Password:"
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <button 
                    disabled={invalid || pristine || submitting} 
                    type="submit" 
                >
                    Search
                </button>
            </div>
        </form>
    )
}

const mapStateToProps = ({ session: { id, active }}) => ({
    active, 
    id,
});


const mapDispatchToProps = (dispatch) => ({
    startSession: (val) => {
        dispatch(startSessionAction(val))
    }
});

const form = connect(mapStateToProps, mapDispatchToProps)(SignInModal);

const validate = ({ email, password }) => ({
    email: password && !email && 'Required!',
    password: email && !password && 'Required!',
})

export default reduxForm({ form: 'signin', validate })(form);
