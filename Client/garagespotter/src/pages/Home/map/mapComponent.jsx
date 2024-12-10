import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RoutingMachine from "./RoutineMachine.jsx";
import L from "leaflet";
import DefaultSidebar from "./defaultSidebar/DefaultSidebar.jsx";
import BluePin from "../../../assets/images/blue.svg";
import RedPin from "../../../assets/images/red.svg";
import ChargerPin from "../../../assets/images/charger.png"; // Add a new icon for electric chargers
import MapSidebar from "./mapSidebar/MapSidebar.jsx";
import style from "./map.module.scss";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
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

const chargerIcon = L.icon({
    iconUrl: ChargerPin,
    iconSize: [63, 71],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapComponent = ({ garageSpots, eChargers, lat, lon }) => {
    const [userPosition, setUserPosition] = useState({
        lat: lat | "32.2123",
        lng: lon | "20.1233",
    });
    const [clickedMarkerPosition, setClickedMarkerPosition] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarageSpotId, setSelectedGarageSpotId] = useState(0);
    const [distanceToSpot, setDistanceToSpot] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [distanceFilter, setDistanceFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [isGarageSpot, setIsGarageSpot] = useState(true);
    const [showGarageSpots, setShowGarageSpots] = useState(true);
    const [chargerTypeFilter, setChargerTypeFilter] = useState("");
    const [clearRoutes, setClearRoutes] = useState(false);

    const countDistanceToSpot = (spot) => {
        const convertedDistance = getDistanceToSpot(userPosition, spot);
        setDistanceToSpot(convertedDistance);
        setSelectedGarageSpotId(spot.id);
        setClickedMarkerPosition({
            lat: spot.latitude,
            lng: spot.longitude,
        });
    };

    const handleMarkerClick = (spot, checkIfGarageSpot) => {
        setClearRoutes(false);
        setIsGarageSpot(checkIfGarageSpot);
        countDistanceToSpot(spot);
        setSidebarOpen(true);
    };

    const filteredGarages = garageSpots
        .filter((garage) => {
            const matchesSearchTerm = garage.locationName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesDistance =
                !distanceFilter ||
                getDistanceToSpot(userPosition, garage) <=
                    parseInt(distanceFilter);

            const matchesPrice =
                !priceFilter || garage.price <= parseInt(priceFilter);

            return matchesSearchTerm && matchesDistance && matchesPrice;
        })
        .map((garage) => ({
            ...garage,
            distance: userPosition
                ? getDistanceToSpot(userPosition, garage)
                : null,
        }));

    const filteredChargers = eChargers
        .filter((charger) => {
            const matchesSearchTerm = charger.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesDistance =
                !distanceFilter ||
                getDistanceToSpot(userPosition, charger) <=
                    parseInt(distanceFilter);

            const matchesPrice =
                !priceFilter || charger.price <= parseInt(priceFilter);

            const matchChargerType =
                !chargerTypeFilter || charger.chargerType === chargerTypeFilter;

            return (
                matchesSearchTerm &&
                matchesDistance &&
                matchesPrice &&
                matchChargerType
            );
        })
        .map((charger) => ({
            ...charger,
            distance: userPosition
                ? getDistanceToSpot(userPosition, charger)
                : null,
        }));

    // Function to close the sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    useEffect(() => {
        setClearRoutes(true);
        console.log(clearRoutes);
    }, [
        distanceFilter,
        searchTerm,
        chargerTypeFilter,
        priceFilter,
        showGarageSpots,
    ]);

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

                {showGarageSpots
                    ? filteredGarages.map((spot, index) => (
                          <Marker
                              key={`garage-${index}`}
                              position={[spot.latitude, spot.longitude]}
                              icon={spot.isAvailable ? blueIcon : redIcon}
                              eventHandlers={{
                                  click: () => handleMarkerClick(spot, true),
                              }}
                          >
                              <Popup>
                                  {spot.locationName} <br /> {spot.address}
                              </Popup>
                          </Marker>
                      ))
                    : filteredChargers.map((charger, index) => (
                          <Marker
                              key={`charger-${index}`}
                              position={[charger.latitude, charger.longitude]}
                              icon={chargerIcon}
                              eventHandlers={{
                                  click: () =>
                                      handleMarkerClick(charger, false),
                              }}
                          >
                              <Popup>
                                  {charger.locationName} <br />{" "}
                                  {charger.address}
                              </Popup>
                          </Marker>
                      ))}

                {userPosition && clickedMarkerPosition && !clearRoutes && (
                    <RoutingMachine
                        key={`${clickedMarkerPosition.lat}-${clickedMarkerPosition.lng}`}
                        start={userPosition}
                        end={clickedMarkerPosition}
                    />
                )}
            </MapContainer>

            <DefaultSidebar
                isOpen={sidebarOpen}
                filteredGarages={filteredGarages}
                filteredChargers={filteredChargers}
                setSidebarOpen={setSidebarOpen}
                setSelectedGarageSpotId={setSelectedGarageSpotId}
                countDistanceToSpot={countDistanceToSpot}
                selectedGarageSpotId={selectedGarageSpotId}
                userPosition={userPosition}
                showGarageSpots={showGarageSpots}
                setShowGarageSpots={setShowGarageSpots}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                distanceFilter={distanceFilter}
                setDistanceFilter={setDistanceFilter}
                setPriceFilter={setPriceFilter}
                priceFilter={priceFilter}
                chargerTypeFilter={chargerTypeFilter}
                setChargerTypeFilter={setChargerTypeFilter}
                setIsGarageSpot={setIsGarageSpot}
                setClearRoutes={setClearRoutes}
            />
            <MapSidebar
                isGarageSpot={isGarageSpot}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                garageSpotId={selectedGarageSpotId}
                distance={distanceToSpot}
            />
        </div>
    );
};

export default MapComponent;
