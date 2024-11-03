import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "./mappersidebar.css";

const createRoutineMachineLayer = ({ start, end }) => {
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
            if (point == 1) {
                return null;
            }

            const marker = L.marker([start.lat, start.lng]);

            return marker;
        },
    });

    instance.on("routesfound", function () {
        if (instance._routes) {
            instance._clearLines();
        }
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
