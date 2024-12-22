import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutineMachine";
import DefaultSidebar from "./defaultSidebar/DefaultSidebar";
import MapSidebar from "./mapSidebar/MapSidebar";
import { SpotMarkers } from "../../../assets/spotmarkers/spotMarkers";
import { filterSpots } from "../../../utils/mapfilters";
import { getDistanceToSpot } from "../../../utils/distanceUtils";
import { getCurrentPosition } from "../../../utils/geolocation";
import style from "./map.module.scss";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

const MapComponent = ({
    garageSpots,
    eChargers,
    lat,
    lon,
    userLat,
    userLng,
}) => {
    const [mapCenter] = useState({
        lat: lat || "44.787197",
        lng: lon || "20.457273",
    });

    const [userPosition, setUserPosition] = useState(
        userLat && userLng ? { lat: userLat, lng: userLng } : null
    );

    const [clickedMarkerPosition, setClickedMarkerPosition] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarageSpotId, setSelectedGarageSpotId] = useState(0);
    const [distanceToSpot, setDistanceToSpot] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: "",
        distanceFilter: "",
        priceFilter: "",
        chargerTypeFilter: "",
    });
    const [isGarageSpot, setIsGarageSpot] = useState(true);
    const [showGarageSpots, setShowGarageSpots] = useState(true);
    const [clearRoutes, setClearRoutes] = useState(false);

    useEffect(() => {
        const getUserLocation = async () => {
            if (!userPosition) {
                try {
                    const position = await getCurrentPosition();
                    setUserPosition(position);
                } catch (error) {
                    console.error("Error getting user location:", error);
                }
            }
        };

        getUserLocation();
    }, [userPosition]);

    const countDistanceToSpot = (spot) => {
        if (userPosition) {
            const convertedDistance = getDistanceToSpot(userPosition, spot);
            setDistanceToSpot(convertedDistance);
        }
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

    const filteredGarages = React.useMemo(() => {
        return filterSpots(garageSpots, filters, userPosition);
    }, [garageSpots, filters, userPosition]);

    const filteredChargers = React.useMemo(() => {
        return filterSpots(eChargers, filters, userPosition);
    }, [eChargers, filters, userPosition]);

    useEffect(() => {
        setClearRoutes(true);
    }, [filters, showGarageSpots]);

    return (
        <div className={style.mapContainer}>
            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={7}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {showGarageSpots ? (
                    <SpotMarkers
                        spots={filteredGarages}
                        isGarageSpot={true}
                        onMarkerClick={handleMarkerClick}
                    />
                ) : (
                    <SpotMarkers
                        spots={filteredChargers}
                        isGarageSpot={false}
                        onMarkerClick={handleMarkerClick}
                    />
                )}

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
                garageSpots={filteredGarages}
                chargers={filteredChargers}
                setSidebarOpen={setSidebarOpen}
                setSelectedGarageSpotId={setSelectedGarageSpotId}
                countDistanceToSpot={countDistanceToSpot}
                selectedGarageSpotId={selectedGarageSpotId}
                userPosition={userPosition}
                showGarageSpots={showGarageSpots}
                setShowGarageSpots={setShowGarageSpots}
                filters={filters}
                setFilters={setFilters}
                setIsGarageSpot={setIsGarageSpot}
                setClearRoutes={setClearRoutes}
            />

            <MapSidebar
                isGarageSpot={isGarageSpot}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                garageSpotId={selectedGarageSpotId}
                distance={distanceToSpot}
            />
        </div>
    );
};

export default MapComponent;
