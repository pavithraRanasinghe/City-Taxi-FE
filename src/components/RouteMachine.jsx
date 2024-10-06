import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ pickupLocation, dropoffLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(pickupLocation), L.latLng(dropoffLocation)],
      routeWhileDragging: true,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [pickupLocation, dropoffLocation, map]);

  return null;
};
export default RoutingMachine;
