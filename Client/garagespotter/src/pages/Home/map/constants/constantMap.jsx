import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

const MapConstant = ({ setLatlng }) => {
    const [userPosition, setUserPosition] = useState(null);

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

    function LeafletgeoSearch() {
        const map = useMap();
        useEffect(() => {
            const provider = new OpenStreetMapProvider({
                params: {
                    "accept-language": "en", // Force English language results
                    format: "json",
                },
            });

            const searchControl = new GeoSearchControl({
                provider,
                style: "bar",
                showMarker: false,
                searchLabel: "Search for a location", // English label
                notFoundMessage: "No results found", // English message
            });

            map.addControl(searchControl);
            return () => map.removeControl(searchControl);
        }, []);

        return null;
    }

    const MapClickHandler = () => {
        useMapEvents({
            async click(e) {
                window.scrollTo({
                    top: 900,
                    behavior: "smooth",
                });
                const { lat, lng } = e.latlng;
                setLatlng([lat, lng]);

                // Hide existing markers
                const markers = document.querySelectorAll(
                    ".leaflet-marker-icon"
                );
                markers.forEach((marker) => (marker.style.display = "none"));
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={
                userPosition
                    ? [userPosition.lat, userPosition.lng]
                    : [43.162, 20.533]
            }
            zoom={14}
            style={{ height: "100vh", width: "100%" }}
        >
            <MapClickHandler />
            <LeafletgeoSearch />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    );
};

export default MapConstant;
