import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';
import { registerDeviceAction } from '../../redux/actions/accountActions';

const SubmitError = styled.div`
    padding-top: 1vh;
    height: 5vh;
    color: red;
`;
const Error = styled.div`
    font-size: 2vmin;
    color: red;
`;
const Title = styled.h4`
    margin: 0 0 2vh 0;
`;
const Form = styled.form`
    text-align: left;
    padding: 2vh 0 1vh 6vh;
    width: 85%;
    @media only screen and (max-width: 800px) { 
        width: 98%;
        padding: 3vh 1vh 1vh 1vh;
    }
`;
const InputDiv = styled.div`
    padding: 1vh 1vh 2vh 0;
`;
const Input = styled.input`
    border: 1px solid grey;
    border-radius: 1vmin;
    line-height: 4vmin;
    padding: 1vmin 1vmin 1vmin 1vmin;
    font-size: 0.8em;
    width: 100%;
    @media only screen and (max-width: 800px) { font-size: 1em; }
`;
const Button = styled.button`margin-right: 2vh;`;

const InputField = ({ input, label, type, placeholder, disabled, note, meta: { error, touched }}) => (
    <div>
        <label>{label}</label>
        <InputDiv>
            <Input {...input} disabled={disabled} placeholder={placeholder || label} type={type} />
            {note && <div><small>{note}</small><br /></div>}
            {error && touched && <Error>{error}</Error>}
        </InputDiv>
    </div>
)

const normalizeSpaces = value => value && value.replace(' ', '')

const DeviceForm = ({ handleSubmit, invalid, pristine, submitting, error, loading, registerDevice, closeForm }) =>
    <Form onSubmit={handleSubmit(registerDevice)}>
        <Title>Add a Device:</Title>
        <Field
            component={InputField}
            disabled={loading}
            label="Tracking Device name:"
            name="trackerName"
            placeholder="Tracking Device name:"
            type="text"
            normalize={normalizeSpaces}
        />
        <Field
            component={InputField}
            disabled={loading}
            label="Unique tracking device ID:"
            name="trackerID"
            note="Savely secure this ID and do not disclose it to anyone. This may lead to conterfeit location history!"
            placeholder="Uninque Tracking Device ID:"
            type="text"
            normalize={normalizeSpaces}
        />
        <Field
            component={InputField}
            disabled={loading}
            label="Device IP:"
            name="trackerIP"
            note="If IP of the device changes you will have to confirm your device via email."
            placeholder="Tracking Device IP:"
            type="text"
            normalize={normalizeSpaces}
        />
        {<SubmitError>{error && typeof error == 'string' ? error : ''}</SubmitError>}
        <Button 
            disabled={invalid || pristine || submitting || loading}
            type="submit" 
        >
            Add Device
        </Button>
        <Button type="back" onClick={closeForm} onKeyPress={closeForm}>
            Back
        </Button>
    </Form>

const validate = ({ trackerID, trackerIP, trackerName }) => ({
    trackerID: (!trackerID && 'Required!') 
        || (trackerID.length > 20 && 'ID is too long!') 
        || (trackerID.length < 10 && 'ID is too short!') 
        || (trackerID.indexOf(' ') + 1 && 'White spaces are not allowed!'),
    trackerIP: (!trackerIP && 'Required!') 
        || (trackerIP.length > 39 && 'IP is too long!')
        || (trackerIP.length < 7 && 'IP is too short!')
        || (trackerIP.indexOf(' ') + 1 && 'White spaces are not allowed!'),
    trackerName: (!trackerName && 'Required!')
        || (trackerName.length > 40 && 'Name is too long!') 
        || (trackerName.indexOf(' ') + 1 && 'White spaces are not allowed!'),
})

function mapStateToProps({ account: { loading, error }}) {
    return { loading, error };
}

const mapDispatchToProps = (dispatch) => ({
    registerDevice: () => dispatch(registerDeviceAction()),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(DeviceForm);
 
export default reduxForm({ form: 'addTracker', validate })(connected);