import L from "leaflet";
import placeholderIcon from "../../../../assets/images/placeholder.png";

export const createCustomIcon = () =>
    L.icon({
        iconUrl: placeholderIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
