import L from "leaflet";
import BluePin from "../../assets/images/blue.svg";
import RedPin from "../../assets/images/red.svg";
import ChargerPin from "../../assets/images/charger.png";

export const redIcon = L.icon({
    iconUrl: RedPin,
    iconSize: [45, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const blueIcon = L.icon({
    iconUrl: BluePin,
    iconSize: [45, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

export const chargerIcon = L.icon({
    iconUrl: ChargerPin,
    iconSize: [63, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
