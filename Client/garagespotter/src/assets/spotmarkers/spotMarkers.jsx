import React from "react";
import { Marker, Popup } from "react-leaflet";
import { blueIcon, redIcon, chargerIcon } from "../icons/mapicons";

export const SpotMarkers = ({ spots, isGarageSpot, onMarkerClick }) => {
    const getIcon = (spot) => {
        if (!isGarageSpot) return chargerIcon;
        return spot.isAvailable ? blueIcon : redIcon;
    };

    return spots.map((spot, index) => (
        <Marker
            key={`${isGarageSpot ? "garage" : "charger"}-${index}`}
            position={[spot.latitude, spot.longitude]}
            icon={getIcon(spot)}
            eventHandlers={{
                click: () => onMarkerClick(spot, isGarageSpot),
            }}
        >
            <Popup>
                {spot.locationName || spot.name} <br /> {spot.address}
            </Popup>
        </Marker>
    ));
};
