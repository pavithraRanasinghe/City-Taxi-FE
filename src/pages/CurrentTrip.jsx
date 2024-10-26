import { useEffect } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const CurrentTrip = () => {
  useEffect(() => {}, []);

  return (
    <>
      <MapContainer
        center={[7.8731, 80.7718]} // Sri Lanka coordinates
        zoom={8}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* {pickupLocation && <Marker position={pickupLocation} />}
        {dropoffLocation && <Marker position={dropoffLocation} />}  */}
      </MapContainer>
    </>
  );
};

export default CurrentTrip;
