import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "./mappersidebar.css";
import placeholderIcon from "../../../assets/images/placeholder.png";

const createRoutineMachineLayer = ({ start, end }) => {
    const customIcon = L.icon({
        iconUrl: placeholderIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    const instance = L.Routing.control({
        waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
        lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 10 }],
        },
        show: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: function (point) {
            if (point === 1) {
                return null;
            }

            const marker = L.marker([start.lat, start.lng], {
                icon: customIcon,
            });
            return marker;
        },
    });

    instance.on("routesfound", function (e) {
        if (instance._routes) {
            instance._clearLines();
        }

        // Get the bounds of the route
        const bounds = L.latLngBounds(e.routes[0].coordinates);

        // Fit the bounds with padding to shift the route to the left
        instance._map.fitBounds(bounds, {
            padding: [50, 300], // [top/bottom padding, left/right padding]
            maxZoom: 15,
        });
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
