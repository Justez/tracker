import React from 'react';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

const Header = styled.h2`padding-left: 2vh;`;
const Hr = styled.hr`border: 1px solid lightgray;`;
const Content = styled.div`padding: 2vh 2vh 2vh 2vh;`;
const InputDiv = styled.div`padding: 1vh 1vh 2vh 0;`;
const Input = styled.input`
    border: 1px solid grey;
    border-radius: 1vmin;
    line-height: 5vmin;
    padding: 1vmin 1vmin 1vmin 1vmin;
    font-size: 0.8em;
    width: 100%;
    @media only screen and (max-width: 800px) { font-size: 1em; }
`;
const Error = styled.small`
    font-size: 2vmin;
    color: red;
`;
const Form = styled.form`
    text-align: left;
    width: 50vw;
    @media only screen and (max-width: 800px) { width: 100%; }
    @media only screen and (min-width: 801px) { padding-left: 25%; }
`;
const Container = styled.div`
    width: 100%;
    background-color: white;
    color: black;
    padding: 10vh 0 2vh 0;
    font-size: 0.8em;
    font-weight: lighter;
    display: inline-flex;
`;

const InputField = ({ input, label, type, placeholder, disabled, note, meta: { error, touched }}) => (
    <div className="form-item">
        <label>{label}</label>
        <InputDiv>
            <Input {...input} disabled={disabled} placeholder={placeholder || label} type={type} />
            {note && <div><small>{note}</small><br /></div>}
            {error && touched && <Error>{error}</Error>}
        </InputDiv>
    </div>
)

class Register extends React.Component {
    state = {
        error: '',
        loading: false,
    };

    submit = (vals) => {
        if (vals.email && vals.password && vals.trackerID) {
            this.setState({ loading: true });
            fetch('/accounts/create', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(vals),
            })
                .then((response) => response.json())
                .then((info) => console.log(info))
                .catch(() => this.setState({ error: 'Unexpected error occured... We are checking on it! Please try again later.' }))
                .finally(() => this.setState({ loading: false }))
        }
    }   

    render() {
        const { handleSubmit, pristine, invalid, submitting } = this.props;
        const { loading, error } = this.state;
        
        return (
            <Container>
                <Form id="sign-in-modal-form" onSubmit={handleSubmit(this.submit)}>
                    {error && <Error>{error}</Error>}
                    <Header>Register your Tracker:</Header>
                    <Hr />
                    <Content>
                        {this.props.warning && <div className="warning">{this.props.warning}</div>}
                        {this.props.error && <div className="error">{this.props.error}</div>}
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
                            label="Unique tracking device ID:"
                            name="trackerID"
                            note="Savely secure this ID and do not disclose it to anyone. This may lead to conterfeit location history!"
                            type="text"
                            placeholder="Uninque tracking device ID:"
                        />
                        <Field
                            component={InputField}
                            disabled={loading}
                            label="Password:"
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <Field
                            component={InputField}
                            disabled={loading}
                            label="Repeat Password:"
                            name="passwordRepeat"
                            type="password"
                            placeholder="Password again:"
                        />
                        <button 
                            disabled={invalid || pristine || submitting}
                            type="submit" 
                        >
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                    </Content>
                </Form>
            </Container>
        )
    }
}

const validate = ({ email, password, passwordRepeat, trackerID }) => ({
    email: !email && 'Required!',
    trackerID: !trackerID && 'Required!',
    password: (!password && 'Required!') || (
        password && passwordRepeat && (password !== passwordRepeat) && 'Passwords do not match!'
    ),
    passwordRepeat: (!passwordRepeat && 'Required!') || (
        password && passwordRepeat && (password !== passwordRepeat) && 'Passwords do not match!'
    ),
})

export default reduxForm({ form: 'signin', validate })(Register);
