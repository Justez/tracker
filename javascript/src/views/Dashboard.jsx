import React from 'react';
import { connect } from 'react-redux';
import { endSessionAction } from '../redux/actions/sessionActions';
import { getUserDevicesAction } from '../redux/actions/accountActions';
import DeviceForm from './components/DeviceRegisterForm';
import styled from 'styled-components';

const Wrapper = styled.div`
    padding-top: 12vh;
    min-height: 75vh;
    width: 98%;
`;
const Title = styled.h2`
    margin: 0 0 0 2vw;
    text-align: left;
`;
const Content = styled.div`
    @media only screen and (min-width: 801px) { display: inline-flex; }
    width: 98%;
`;
const Map = styled.div`
    padding: 1vh 0 1vh 0;
    flex-direction: column;
    @media only screen and (max-width: 800px) { padding: 1vh 1vh 1vh 1vh; }
`;
const Device = styled.div`
    padding: 2vh 2vw 2vh 2vw;
    border: 2px solid white;
    border-radius: 1vh;
    margin-top: 2vh;
    :hover {
        cursor: pointer;
        font-weight: bolder;
    }
`;
const Button = styled.button`
    margin-top: 5vh;
`;

class Dashboard extends React.Component {
    state = { 
        showForm: false,
    }
    
    componentDidMount() {
        this.props.getUserDevices();
    }

    componentDidUpdate(prevProps) {
        prevProps.devices.length < this.props.devices.length && this.setState({ showForm: false })
    }

    render() {
        const { active, devices, loading } = this.props;
        const { showForm } = this.state;
        
        const Devices = styled.div`
            padding: 1vh 1vh 1vh 1vh;
            min-width: ${devices.length ? '40%' : '80%'}
            @media only screen and (max-width: 800px) { padding: 6vh 1vh 1vh 1vh; }
        `;
        
        if (active) {
            return (
                <Wrapper>
                    <Title>
                        Your Devices:
                    </Title>
                    <Content>
                        <Devices>
                            {loading && 'Loading your account...'}
                            {!loading && devices && devices.length > 0 && devices.map(d => 
                                <Device key={d.id}>{d.name}</Device>
                            )}
                            {!loading && devices && devices.length === 0 && 
                                <DeviceForm />
                            }
                            {!loading && !showForm && devices && devices.length > 0 && devices.length < 10 &&
                                <Button onClick={() => this.setState({ showForm: true })}>Add new device</Button>
                            }
                        </Devices>
                        <Map id="map">
                            {showForm && <DeviceForm closeForm={() => this.setState({ showForm: false })}/>}
                        </Map>
                    </Content>
                </Wrapper>
            )
        } else {
            return <Wrapper>
                <Title className="title">
                    Your session is not active. Please{' '}
                    <button 
                        onClick={() => document.getElementById("sign-in-modal").style.display = "block"}
                        onKeyPress={() => document.getElementById("sign-in-modal").style.display = "block"}
                    >
                        LOGIN
                    </button>
                </Title>
            </Wrapper> 
        }
    }
}

function mapStateToProps({ session: { active }, account: { devices, loading, status, error }}) {
    return { active, devices, loading, status, error };
}

const mapDispatchToProps = (dispatch) => ({
    endSession: () => dispatch(endSessionAction()),
    getUserDevices: () => dispatch(getUserDevicesAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

