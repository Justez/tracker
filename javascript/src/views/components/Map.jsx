import React from 'react';
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
    border: 1px solid white;
    border-radius: 1vmin;
`;

class MapContainer extends React.Component {
    state = {
        loading: false,
        showMap: false,
        error: '',
    };
    
    render() {
        const { tracks, trackDays } = this.props;
        const { loading, showMap, error } = this.state;
        
        if (!tracks) {
            return (
                <Wrapper>
                    <Title>
                    </Title>
                    <Content>
                    </Content>
                </Wrapper>
            )
        } else if (tracks) {
            return <Wrapper>
                <Map id="map"></Map>
                hjlkmk
            </Wrapper>
        }
    }
}

export default MapContainer;

