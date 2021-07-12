import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import Fullscreen from 'react-leaflet-fullscreen-plugin';
import './ClassesMap.scss';
import { Card } from 'react-bootstrap';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const ClassesMap = ({ classes }) => {
  const points = [];
  const markers = [];
  classes.forEach((c) => {
    if (c.lat !== undefined && c.lon !== undefined) {
      points.push([c.lat, c.lon]);
      markers.push(
        <Marker position={[c.lat, c.lon]} key={c.id}>
          <Popup>
            {c.title}
            <br />
            {c.meetingAddress.street + ', ' + c.meetingAddress.zip + ' ' + c.meetingAddress.city}
          </Popup>
        </Marker>,
      );
    }
  });

  const options = {
    position: 'topleft',
    title: 'Show me the fullscreen !',
    titleCancel: 'Exit fullscreen mode',
    content: null,
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
    fullscreenElement: false,
  };
  const bounds = L.latLngBounds(points);

  function UpdateMap({ bounds }) {
    const map = useMap();
    setTimeout(() => {
      map.fitBounds(bounds);
      map.invalidateSize();
    }, 250);
    return null;
  }

  return (
    <Card className="shadow">
      <Card.Body>
        <MapContainer
          className="mapContainer"
          scrollWheelZoom={false}
          boundsOptions={{ padding: [50, 50] }}
        >
          <UpdateMap bounds={bounds} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Fullscreen {...options} />
          <MarkerClusterGroup>{markers}</MarkerClusterGroup>
        </MapContainer>
      </Card.Body>
    </Card>
  );
};

export default ClassesMap;
