import React from 'react';
import { connect } from 'react-redux';
import { getUserDevicesAction, deleteDeviceAction } from '../redux/actions/accountActions';
import DeviceForm from './components/DeviceRegisterForm';
import styled from 'styled-components';
import Map from './components/Map';

const Wrapper = styled.div`
    padding-top: 12vh;
    min-height: 75vh;
    width: 98%;
    margin-left: 1vw;
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
const DeviceInfo = styled.div`
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
    word-wrap: break-word;
    border-radius: 1vh;
    width: 90%;
    margin-top: 2vh;
    :hover {
        cursor: pointer;
        color: lightblue;
    }
`;
const Link = styled.button`
    background: none;
    padding: 0 0 0 1vmin;
    color: #25b0fb;
    text-decoration: underline;
`;

class Dashboard extends React.Component {
    state = {
        showForm: false,
        showDevice: undefined,
        loading: false,
        tracks: undefined,
        trackDaySelected: undefined,
        trackDays: undefined,
        error: '',
    }
    
    componentDidMount() {
        this.props.getUserDevices();
        if (!(window.google && window.google.maps)) {
            const script = document.createElement('script');
            const API = 'AIzaSyDbAz1XXxDoKSU2nZXec89rcHPxgkvVoiw';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
            script.async = true;
            document.body.appendChild(script);
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.state.showForm && prevProps.devices.length < this.props.devices.length) {
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
            trackDays: [] 
        });
        const { email, userID } = this.props;

        fetch(process.env.REACT_APP_PROXY + '/devices/trackdays', {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...device, email, userID }),
        })
        .then(response => response.json())
        .then((info) => {
            this.setState({ trackDays: info.trackDays })
            info.status !== 200 && this.setState({ error: info.error || 'Unexpected error ocurred. Please try again later.' })
        })
        .catch(() => this.setState({ trackDays: [] }))
        .finally(() => this.setState({ loading: false }));
    }

    getTracksByDay = (day) => {
        const { email, userID } = this.props;
        this.setState({ trackDaySelected: day, loading: true, error: '' })

        fetch(process.env.REACT_APP_PROXY + '/devices/tracks', {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: day.id, email, userID }),
        })
        .then(response => response.json())
        .then((info) => {
            if (info.status === 200) {
                this.setState({ tracks: info.tracks || [] })
            } else
                this.setState({ 
                    error: info.error || 'Failed to retrieve data. Please contact the administrator.', 
                    trackDaySelected: undefined, 
                    tracks: undefined,
                })
        })
        .catch((err) => this.setState({ 
            error: err.error || 'Failed to retrieve data. Please contact the administrator.', 
            trackDaySelected: undefined, 
            tracks: undefined,
        }))
        .finally(() => this.setState({ loading: false }))
    }

    handleChangeDay = () => this.setState({ tracks: undefined, trackDaySelected: undefined })

    handleDeleteDevice = () => {
        const { showDevice } = this.state;

        this.setState({
            showDevice: undefined,
            tracks: undefined,
            trackDaySelected: undefined,
            trackDays: undefined,
        });

        this.props.deleteDevice(showDevice);
    }

    render() {
        const { active, devices, loading, error: deleteError } = this.props;
        const { showForm, showDevice, tracks, error, trackDays, loading: loadingTracks, trackDaySelected } = this.state;

        const Devices = styled.div`
            padding: 1vh 1vh 1vh 1vh;
            min-width: ${devices.length ? '40%' : '80%'}
            @media only screen and (max-width: 800px) { padding: 6vh 1vh 1vh 1vh; }
        `;
        
        if (active && !tracks) {
            return (
                <Wrapper>
                    <Title>
                        Your Devices:
                    </Title>
                    <Content>
                        <Devices>
                            {loading && !devices.length && 'Loading account...'}
                            {loading && devices.length > 0 && 'Processing request...'}
                            {!loading && deleteError && <Error>{deleteError}</Error>}   
                            {!loading && devices && devices.length > 0 && devices.map(d => 
                                <Device key={d.id} onClick={() => !loading && showDevice ? showDevice.id !== d.id : true && this.openDevice(d)}>
                                    {showDevice && showDevice.id === d.id ? <Success>{d.name}</Success> : d.name}
                                </Device>
                            )}
                            {!loading && devices && devices.length > 0 && devices.length < 10 &&
                                <Device onClick={() => this.setState({ showForm: true, showDevice: undefined })}>
                                    Add new device
                                </Device>
                            }
                            {!loading && devices && devices.length === 0 && <DeviceForm />}
                        </Devices>
                        {showForm && <DeviceForm closeForm={() => this.setState({ showForm: false })}/>}
                        {showDevice &&
                            <DeviceInfo>
                                {!loadingTracks && <Error>{error}</Error>}
                                {loadingTracks && !trackDays.length && <p>Loading days recorded...</p>}
                                {!loadingTracks && trackDays && trackDays.length === 0 && <p>There are no tracking points recorded yet!</p>}
                                {loadingTracks && trackDaySelected && <p>Loading tracks and opening map...</p>}
                                {trackDays.length > 0 && <div>
                                    Days recorded: 
                                        {trackDays && trackDays.map(d => 
                                            <Device
                                                key={d.id} 
                                                onClick={() => !loadingTracks && this.getTracksByDay(d)}
                                            >
                                                {d.name}
                                            </Device>
                                        )}
                                    </div>
                                }
                                <Device onClick={this.handleDeleteDevice}>
                                    Delete device
                                </Device>
                            </DeviceInfo>
                        }
                    </Content>
                </Wrapper>
            )
        } else if (tracks) {
            return <Wrapper>
                    <Map device={showDevice} daySelected={trackDaySelected} tracks={tracks} goBack={this.handleChangeDay} />
                </Wrapper>
        }
        return <Wrapper>
            <Content>
                Your session is not active. Please
                {' '}
                <Link 
                    onClick={() => document.getElementById("sign-in-modal").style.display = "block"}
                    onKeyPress={() => document.getElementById("sign-in-modal").style.display = "block"}
                >
                    LOGIN
                </Link>
            </Content>
        </Wrapper> 
    }
}

const mapStateToProps = ({
    session: { active, email, userID }, 
    account: { devices, loading, status, error }
}) => ({ active, email, userID, devices, loading, status, error });    

const mapDispatchToProps = (dispatch) => ({
    getUserDevices: () => dispatch(getUserDevicesAction()),
    deleteDevice: (device) => dispatch(deleteDeviceAction(device)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

