import React from 'react';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styled from 'styled-components';

// const Success = styled.div`color: #25b0fb;`;
const Error = styled.div`color: red;`;
const Title = styled.h2`
    margin: 0 0 2vh 2vw;
    font-size: 4vmin;
    text-align: left;

`;
const Map = styled.div`
    border: 1px solid white;
    min-height: 80vh;
    border-radius: 1vmin;
`;
const Links = styled.span`
    position: absolute;
    right: 2vw;
`;
const Link = styled.button`
    padding: 0 0 0 2vh;
    background: none;
    color: #25b0fb;
    text-decoration: underline;
`;

const markerContent = (track) => `
    <span style={{ background-color: 'white' }}>
        ${track.date.replace('T', ' ').replace('Z', '').split('.')[0]}
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
                this.map = new window.google.maps.Map(document.getElementById('map'), {
                    center: { lat: +tracks[0].coords.lat, lng: +tracks[0].coords.lng },
                    zoom: 11,
                });

                tracks.forEach(t => {
                    var infowindow = new window.google.maps.InfoWindow({
                        content: markerContent(t)
                    });
              
                    const marker = new window.google.maps.Marker({
                        position: { lat: +t.coords.lat, lng: +t.coords.lng },
                        map: this.map,
                        title: t.date
                    });
                    marker.addListener('click', function() {
                        infowindow.open(this.map, marker);
                    });
                });
            }
        }
    }

    export = () => {
        const { daySelected, device, tracks } = this.props;
        this.setState({ loading: true })
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: `${device.name}`,
            Subject: `Track data for ${device.name}`,
            Author: "Tracker Server",
            CreatedDate: Date().split('GMT')[0].trim()
        };
        
        wb.SheetNames.push("1 Sheet");

        const data = [['Date', 'Lat', 'Lng']];
        tracks.forEach(t => data.push([t.date, t.coords.lat, t.coords.lng]));
        wb.Sheets["1 Sheet"] = XLSX.utils.aoa_to_sheet(data);
        const wbout = XLSX.write(wb, { bookType:'xlsx',  type: 'binary' });
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `${device.name} ${daySelected.name}.xlsx`);
        this.setState({ loading: false })
    }
    
    render() {
        const { daySelected, goBack } = this.props;
        const { loading, error } = this.state;

        return <div>
            <Title>Selected date: {daySelected.name} 
                <Links>
                    {loading ? 'Generating file...' : <Link onClick={this.export}>Export</Link>}
                    <Link onClick={goBack}>Back</Link>
                </Links>
                <Error>{error}</Error>
            </Title>
            <Map id="map"></Map>
        </div>
    }
}

export default MapContainer;

