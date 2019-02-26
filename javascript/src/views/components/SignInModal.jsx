import React from 'react';
import { connect } from 'react-redux';
import { startSessionAction } from '../../redux/actions/sessionActions';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form';

const Header = styled.p`padding-left: 2vh;`;
const Hr = styled.hr`border: 1px solid lightgray;`;
const Content = styled.div`padding: 0 2vh 2vh 2vh;`;
const InputDiv = styled.div`padding: 1vh 0 2vh 0;`;
const Input = styled.input`
    line-height: 4vmin;
    padding-left: 1vmin;
    width: 100%;
`;
const Error = styled.small`
    font-size: 2vmin;
    color: red;
`;
const Form = styled.form`
    position: absolute;
    text-align: left;
    top: 50%;
    left: 50%;
    font-size: 1em;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    background-color: white;
    color: black;
    border: 1px solid lightgray;
    min-width: 50vw;
    min-height: 50vh;
    @media only screen and (max-width: 800px) {
        width: 100%;
    }
`;

const InputField = ({ input, label, type, disabled, meta: { error, touched }}) => (
    <div className="form-item">
        <label>{label}</label>
        <InputDiv>
            <Input {...input} disabled={disabled} placeholder={label} type={type} />
            {error && touched && <Error>{error}</Error>}
        </InputDiv>
    </div>
)

const SignInModal = (props) => {
    const { handleSubmit, pristine, invalid, submitting, loading } = props;
    
    const submit = (vals) => {
        if (vals.email && vals.password) {
            props.startSession(vals)
        }
    }

    return (
        <Form id="sign-in-modal-form" onSubmit={handleSubmit(submit)}>
            <Header>Login to Tracker portal:</Header>
            <Hr />       
            <Content>
                {loading && <div className="loading">loading...</div>}
                {props.warning && <div className="warning">{props.warning}</div>}
                {props.error && <div className="error">{props.error}</div>}
                <Field
                    component={InputField}
                    disabled={loading}
                    label="Email:"
                    name="email"
                    type="email"
                    placeholder="Email"
                />
                <Field
                    component={InputField}
                    disabled={loading}
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
            </Content>
        </Form>
    )
}

const mapStateToProps = ({ session: { id, active, loading, warning, error }}) => ({
    active, 
    error,
    id,
    loading,
    warning,
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
