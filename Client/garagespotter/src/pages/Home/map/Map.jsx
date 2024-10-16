import React, { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
} from "react-leaflet";
import RoutingMachine from "./RoutineMachine";
import L from "leaflet";
import getDistance from "geolib/es/getDistance";
import convertDistance from "geolib/es/convertDistance";
import DefaultSidebar from "./defaultSidebar/DefaultSidebar";
import BluePin from "../../../assets/images/blue.svg";
import RedPin from "../../../assets/images/red.svg";
import Sidebar from "./mapSidebar/MapSidebar";
import style from "./map.module.scss";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import icon from "./constants/constantMarker.js";
const redIcon = L.icon({
    iconUrl: RedPin,
    iconSize: [45, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const blueIcon = L.icon({
    iconUrl: BluePin,
    iconSize: [45, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const MapComponent = ({ garageSpots }) => {
    const [userPosition, setUserPosition] = useState(null);
    const [clickedMarkerPosition, setClickedMarkerPosition] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarageSpotId, setSelectedGarageSpotId] = useState(0);
    const [distanceToSpot, setDistanceToSpot] = useState(0);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("position", position);
                    if (position.coords) {
                        setUserPosition({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    }
                },
                (error) => {
                    console.error("Error fetching user location:", error);
                }
            );
        }
    }, []);

    function LeafletgeoSearch() {
        const map = useMap();
        useEffect(() => {
            const provider = new OpenStreetMapProvider();

            const searchControl = new GeoSearchControl({
                provider,
                marker: {
                    icon,
                },
                style: "bar",
            });

            map.addControl(searchControl);

            return () => map.removeControl(searchControl);
        }, []);

        return null;
    }
    const countDistanceToSpot = (spot) => {
        const distance = getDistance(
            { latitude: userPosition.lat, longitude: userPosition.lng },
            { latitude: spot.latitude, longitude: spot.longitude }
        );
        let convertedDistance = convertDistance(distance, "km").toFixed(2);
        setDistanceToSpot(convertedDistance);
        setSelectedGarageSpotId(spot.id);
        setClickedMarkerPosition({
            lat: spot.latitude,
            lng: spot.longitude,
        });
    };

    const handleMarkerClick = (spot) => {
        countDistanceToSpot(spot);
        setSidebarOpen(true);
    };

    // Function to close the sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={style.mapContainer}>
            <MapContainer
                center={
                    userPosition
                        ? [userPosition.lat, userPosition.lng]
                        : [43.162, 20.533]
                }
                zoom={14}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {garageSpots.map((spot, index) => (
                    <Marker
                        key={index}
                        position={[spot.latitude, spot.longitude]}
                        icon={spot.isAvailable ? blueIcon : redIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(spot),
                        }}
                    >
                        <Popup>
                            {spot.locationName} <br /> {spot.address}
                        </Popup>
                    </Marker>
                ))}

                {userPosition && clickedMarkerPosition && (
                    <RoutingMachine
                        key={`${clickedMarkerPosition.lat}-${clickedMarkerPosition.lng}`}
                        start={userPosition}
                        end={clickedMarkerPosition}
                    />
                )}
            </MapContainer>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                garageSpotId={selectedGarageSpotId}
                distance={distanceToSpot}
            />
            <DefaultSidebar
                isOpen={sidebarOpen}
                garageSpots={garageSpots}
                setSidebarOpen={setSidebarOpen}
                setSelectedGarageSpotId={setSelectedGarageSpotId}
                countDistanceToSpot={countDistanceToSpot}
                selectedGarageSpotId={selectedGarageSpotId}
            />
        </div>
    );
};

export default MapComponent;
