import React from 'react';
import { connect } from 'react-redux';
import { getUserDevicesAction } from '../redux/actions/accountActions';
import DeviceForm from './components/DeviceRegisterForm';
import styled from 'styled-components';

const Wrapper = styled.div`
    padding-top: 12vh;
    min-height: 75vh;
    width: 98%;
`;
const Success = styled.div`color: #25b0fb;`;
const Error = styled.div`color: red;`;
const Title = styled.h2`
    margin: 0 0 0 2vw;
    text-align: left;
`;
const Content = styled.div`
    @media only screen and (min-width: 801px) { display: inline-flex; }
    width: 98%;
`;
const Map = styled.div`
    margin: 3vh 0 0 1vh;
    padding: 2vh 1vh 1vh 1vh;
    width: 95%;
    overflow: hidden;
    border: 2px solid white;
    border-radius: 1vh;
    text-aligh: left;
    @media only screen and (max-width: 800px) { padding: 1vh 1vh 1vh 1vh; }
`;
const Device = styled.div`
    padding: 2vh 2vw 2vh 2vw;
    border: 2px solid white;
    font-size: 0.8em;
    word-wrap: normal;
    border-radius: 1vh;
    width: 90%;
    margin-top: 2vh;
    :hover {
        cursor: pointer;
        color: lightblue;
    }
`;

class Dashboard extends React.Component {
    state = {
        showForm: false,
        showDevice: undefined,
        loading: false,
        showMap: false,
        tracks: undefined,
        trackDaySelected: undefined,
        trackDays: undefined,
        error: '',
    }
    
    componentDidMount() {
        this.props.getUserDevices();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.devices.length < this.props.devices.length) {
            this.setState({ showForm: false })
        }
    }

    openDevice = (device) => {
        this.setState({ 
            showDevice: device, 
            showForm: false, 
            loading: true, 
            error: '',
            tracks: undefined, 
            trackDaySelected: undefined, 
            trackDays: undefined 
        })
        const { email, userID } = this.props;

        const request = fetch('/accounts/devices/tracks', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...device, email, userID }),
        })

        request.then(
            response => {
                response.json().then((info) => {
                    console.log(info);
                    this.setState({ trackDays: info.trackDays })
                    // if tracks present open map in ID
                    info.status !== 200 && this.setState({ error: info.error || 'Unexpected error ocurred. Please try again later.' })
                })
            }, 
        )
        .catch(() => this.setState({ tracks: [] }))
        .finally(() => this.setState({ loading: false }));
    }

    getTracksByDay = (day) => {
        this.setState({ trackDaySelected: day, loading: true })
    }

    render() {
        const { active, devices, loading } = this.props;
        const { showForm, showDevice, tracks, error, trackDays, loading: loadingTracks, trackDaySelected } = this.state;
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
                        {loading && 'Loading account...'}
                        {!loading && devices && devices.length > 0 && devices.map(d => 
                            <Device key={d.id} onClick={() => !loading && this.openDevice(d)}>
                                {showDevice && showDevice.id === d.id ? <Success>{d.name}</Success> : d.name}
                            </Device>
                        )}
                        {!loading && devices && devices.length > 0 && devices.length < 10 &&
                            <Device onClick={() => this.setState({ showForm: true, showDevice: undefined })}>Add new device</Device>
                        }
                        {!loading && devices && devices.length === 0 && <DeviceForm />}
                    </Devices>
                    {showForm && <DeviceForm closeForm={() => this.setState({ showForm: false })}/>}
                    {showDevice &&
                        <Map>
                            {!loadingTracks && !trackDays && <Error>{error}</Error>}
                            {!loadingTracks && tracks && tracks.length > 0 && <div id="map" />}
                            {!loadingTracks && trackDays && trackDays.length === 0 && <p>There are no tracking points recorded yet!</p>}
                            {trackDays && !tracks && <div>
                                Days recorded: 
                                    {trackDays && trackDays.map(d => 
                                        <Device 
                                            key={d.id} 
                                            onClick={() => this.getTracksByDay(d)}
                                        >
                                                {d.name}
                                        </Device>
                                    )}
                                </div>
                            }
                            {loadingTracks && !trackDays && <div>Loading days recorded...</div>}
                            {loadingTracks && trackDaySelected && <p>Loading tracks and opening map...</p>}
                        </Map>
                    }   
                </Content>
            </Wrapper>)
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

function mapStateToProps({ session: { active, email, userID }, account: { devices, loading, status }}) {
    return { active, email, userID, devices, loading, status };
}

const mapDispatchToProps = (dispatch) => ({
    getUserDevices: () => dispatch(getUserDevicesAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

