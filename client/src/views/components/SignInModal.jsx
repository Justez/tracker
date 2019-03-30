import React from 'react';
import { connect } from 'react-redux';
import { startSessionAction } from '../../redux/actions/sessionActions';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form';
import { toRegister } from '../../utils/routes/navigators';

const Header = styled.p`padding-left: 2vh;`;
const Hr = styled.hr`border: 1px solid lightgray;`;
const Content = styled.div`padding: 0 2vh 2vh 2vh;`;
const InputDiv = styled.div`padding: 1vh 0 2vh 0;`;
const Input = styled.input`
    line-height: 5vmin;
    padding-left: 1vmin;
    width: 98%;
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
const Buttons = styled.div`
    position: relative;
`;
const Button = styled.button`
    display: inline-block;
    position: absolute;
    right: ${props => props.type === 'submit' ? 'auto' : '0'};
`;

const InputField = ({ input, label, type, disabled, placeholder, meta: { error, touched }}) => (
    <div className="form-item">
        <label>{label}</label>
        <InputDiv>
            <Input {...input} disabled={disabled} placeholder={placeholder || label} type={type} />
            {error && touched && <Error>{error}</Error>}
        </InputDiv>
    </div>
)

const SignInModal = (props) => {
    const { handleSubmit, pristine, invalid, submitting, loading, error, warning } = props;

    return (
        <Form id="sign-in-modal-form" onSubmit={handleSubmit(props.startSession)}>
            <Header>Login to Tracker portal:</Header>
            <Hr />
            <Content>
                {warning && <div className="warning">{warning}</div>}
                {error && typeof error == 'string' && <div className="error">{error}</div>}
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
                    name="passwordLogIn"
                    type="password"
                    placeholder="Password"
                />
                <Buttons>
                    <Button 
                        disabled={invalid || pristine || submitting} 
                        type="submit" 
                    >
                        {loading 
                            ? 'Loading...'
                            : 'Login'
                        }
                    </Button>
                    <Button 
                        type="reset"
                        onClick={() => toRegister()}
                    >
                        Register
                    </Button>
                </Buttons>
            </Content>
        </Form>
    )
}

const mapStateToProps = ({ session: { id, active, loading, warning, error }}) => ({
    active, error, id, loading, warning,
});

const mapDispatchToProps = (dispatch) => ({
    startSession: () => dispatch(startSessionAction())
});

const form = connect(mapStateToProps, mapDispatchToProps)(SignInModal);

const validate = ({ email, passwordLogIn }) => ({
    email: passwordLogIn && !email && 'Required!',
    passwordLogIn: email && !passwordLogIn && 'Required!',
})

export default reduxForm({ form: 'signin', validate })(form);
