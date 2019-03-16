import React from 'react';
import styled from 'styled-components';

// const Success = styled.div`color: #25b0fb;`;
// const Error = styled.div`color: red;`;
const Title = styled.h2`
    margin: 0 0 2vh 2vw;
    font-size: 4vmin;
    text-align: left;

`;
// const Content = styled.div`
//     @media only screen and (min-width: 801px) { display: inline-flex; }
//     width: 98%;
// `;
const Map = styled.div`
    border: 1px solid white;
    min-height: 80vh;
    border-radius: 1vmin;
`;
const Link = styled.button`
    background: none;
    padding: 0;
    color: #25b0fb;
    text-decoration: underline;
    right: 2vw;
    position: absolute;
`;

const markerContent = (track) => `
    <span>
        ${track}
    </span>
`;

class MapContainer extends React.Component {
    state = {
        loading: false,
        showMap: false,
        error: '',
    };
    map = null;

    componentDidMount() {
        if (window.google && document.getElementById('map')) {
            const { tracks } = this.props;   
            if (tracks.length && !this.map) {
                new window.google.maps.Map(document.getElementById('map'), {
                    center: { lat: +tracks[0].coords.lat, lng: +tracks[0].coords.lng },
                    zoom: 11,
                });
                tracks.forEach(t => {
                    const marker = new window.google.maps.Marker({
                        position: { lat: +t.coords.lat, lng: +t.coords.lng },
                        // content: markerContent(t.date),
                        title: t.date
                    });
                    marker.setMap(this.map);
                })
            }
        }
    }
    
    render() {
        const { tracks, daySelected, goBack } = this.props;
        
        const { loading, showMap, error } = this.state;
        
        return <div>
            <Title>Selected date: {daySelected.name} <Link onClick={goBack}>Back</Link></Title>
            <Map id="map"></Map>
        </div>
    }
}

export default MapContainer;

