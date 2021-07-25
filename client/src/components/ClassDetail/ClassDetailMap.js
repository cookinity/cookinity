import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Fullscreen from 'react-leaflet-fullscreen-plugin';
import './ClassDetailMap.scss';

const ClassDetailMap = ({ c }) => {
  const addressFormatted =
    c.meetingAddress.street + ', ' + c.meetingAddress.zip + ' ' + c.meetingAddress.city;

  const options = {
    position: 'topleft',
    title: 'Show me the fullscreen !',
    titleCancel: 'Exit fullscreen mode',
    content: null,
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
    fullscreenElement: false,
  };

  return (
    <>
      <h3>
        Meeting Address: {addressFormatted}{' '}
        <FontAwesomeIcon icon="map-marker-alt" className="iconPos fa-fw" />
      </h3>
      <div className="mb-2">
        <span>🤝 You will meet your host at this public location close to his or her home</span>
        <br />
        <span>🔎 Please bring an ID so the host can verify your identity </span>
        <br />
        <span>
          🛒 Depending on the class you will either go shopping together first or go directly to the
          hosts home to start cooking
        </span>
        <br />
        <span>
          📞 After booking you will receive additional contact information from the host to
          coordinate the meetup
        </span>
      </div>
      <MapContainer
        className="detailMapContainer"
        center={[c.lat, c.lon]}
        zoom={16}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Fullscreen {...options} />
        <Marker position={[c.lat, c.lon]}>
          <Popup>Meeting Address: {addressFormatted}</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default ClassDetailMap;
