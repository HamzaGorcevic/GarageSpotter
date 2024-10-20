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
import DefaultSidebar from "./defaultSidebar/DefaultSidebar";
import BluePin from "../../../assets/images/blue.svg";
import RedPin from "../../../assets/images/red.svg";
import Sidebar from "./mapSidebar/MapSidebar";
import style from "./map.module.scss";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import icon from "./constants/constantMarker.js";
import { getDistanceToSpot } from "../../../utils/distanceUtils.js";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [distanceFilter, setDistanceFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
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

    const countDistanceToSpot = (spot) => {
        const convertedDistance = getDistanceToSpot(userPosition, spot);
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

    const filteredGarages = garageSpots.filter((garage) => {
        console.log(getDistanceToSpot(userPosition, garage), distanceFilter);
        const matchesSearchTerm = garage.locationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesDistance =
            !distanceFilter ||
            getDistanceToSpot(userPosition, garage) <= parseInt(distanceFilter);
        console.log(matchesDistance);

        const matchesPrice =
            !priceFilter || garage.price <= parseInt(priceFilter);

        return matchesSearchTerm && matchesDistance && matchesPrice;
    });

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

                {filteredGarages.map((spot, index) => (
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
                filteredGarages={filteredGarages}
                setSidebarOpen={setSidebarOpen}
                setSelectedGarageSpotId={setSelectedGarageSpotId}
                countDistanceToSpot={countDistanceToSpot}
                selectedGarageSpotId={selectedGarageSpotId}
                userPosition={userPosition}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                distanceFilter={distanceFilter}
                setDistanceFilter={setDistanceFilter}
                setPriceFilter={setPriceFilter}
                priceFilter={priceFilter}
            />
        </div>
    );
};

export default MapComponent;
