import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./mapsidebar.module.scss";
import LeftArrow from "../../../../assets/images/leftArrow.svg";
import redCar from "../../../../assets/images/redCar.png";
import greenCar from "../../../../assets/images/greenCar.png";
import { AuthContext } from "../../../../context/AuthContext";
import ReservationModal from "../../../../components/Modals/ReservationModal/ReservationModal.jsx";
import { BASE_URL } from "../../../../config/config.js";
import toast from "react-hot-toast";

const MapSidebar = ({
    isOpen,
    onClose,
    garageSpotId,
    distance,
    isGarageSpot,
}) => {
    const { authData } = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [garageSpot, setGarageSpot] = useState(null);
    const [electricCharger, setElectricCharger] = useState(null);
    const [loading, setLoading] = useState(false);
    const sliderRef = useRef(null);

    const handleSliderMovement = (direction) => {
        const slider = sliderRef.current;
        const scrollAmount = slider.offsetWidth;

        slider.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const reserveGarageSpot = async (reservationData) => {
        setLoading(true);
        const response = await fetch(
            `${BASE_URL}/Reservation/reserveSingleSpot`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    garageSpotId: garageSpotId,
                    ...reservationData,
                }),
            }
        );
        setLoading(false);
        const res = await response.json();
        if (res.success) {
            toast.success(res.message);
            fetchGarageSpot();
        } else {
            toast.error(res.message);
        }
    };
    const onGoogleMaps = (lat, lon) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
        window.open(url, "_blank");
    };
    const fetchGarageSpot = async () => {
        const response = await fetch(
            `${BASE_URL}/GarageSpot/getGarageSpot?garageSpotId=${garageSpotId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        const res = await response.json();
        setGarageSpot(res.value);
    };

    const fetchElectricCharger = async () => {
        const response = await fetch(
            `${BASE_URL}/ElectricCharger/getElectricChargerById?id=${garageSpotId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        const res = await response.json();
        setElectricCharger(res.value);
    };

    const addToFavorites = async (spotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/User/addToFavorites?garageSpotId=${spotId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const res = await response.json();
            if (res.success) {
                toast.success("Spot added to favorites!");
            } else {
                toast.error("Failed to add to favorites: " + res.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding to favorites.");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (garageSpotId >= 0) {
            if (isGarageSpot) {
                fetchGarageSpot();
            } else {
                fetchElectricCharger();
            }
        }
    }, [garageSpotId, isGarageSpot]);

    return (
        <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
            <div className={style.sidebarHeader}>
                <button className={style.closeButton} onClick={onClose}>
                    <img src={LeftArrow} alt="Close" />
                </button>
            </div>
            <div className={style.sidebarContent}>
                {isGarageSpot ? (
                    <>
                        {garageSpot?.garageImages?.length > 0 && (
                            <div className={style.imageSlider}>
                                <button
                                    className={`${style.arrow} ${style.arrowLeft}`}
                                    onClick={() => handleSliderMovement("left")}
                                >
                                    &lt;
                                </button>
                                <div
                                    className={style.imageContainer}
                                    ref={sliderRef}
                                >
                                    {garageSpot.garageImages.map(
                                        (image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Garage Image ${
                                                    index + 1
                                                }`}
                                            />
                                        )
                                    )}
                                </div>
                                <button
                                    className={`${style.arrow} ${style.arrowRight}`}
                                    onClick={() =>
                                        handleSliderMovement("right")
                                    }
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                        <h2>{garageSpot?.locationName}</h2>
                        <button
                            className={style.reserveButton}
                            onClick={() => setModalOpen(true)}
                        >
                            Reserve spot
                        </button>
                        <button
                            className={style.reserveButton}
                            onClick={() => addToFavorites(garageSpot.id)}
                        >
                            Add to favorites
                        </button>
                        <button
                            className={style.reserveButton}
                            onClick={() =>
                                onGoogleMaps(
                                    garageSpot.latitude,
                                    garageSpot.longitude
                                )
                            }
                        >
                            Google maps
                        </button>
                        <p>
                            <strong>Address:</strong> {garageSpot?.address}
                        </p>
                        <p>
                            <strong>Available:</strong>{" "}
                            {garageSpot?.isAvailable ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Price:</strong> ${garageSpot?.price}
                        </p>
                        <p>
                            <strong>Distance:</strong> {distance} km
                        </p>
                        <p>
                            <strong>Total Spots:</strong>{" "}
                            {garageSpot?.totalSpots.length}
                        </p>

                        <div className={style.containerForSpots}>
                            {garageSpot?.totalSpots?.map((spot, index) =>
                                spot.isAvailable ? (
                                    <img
                                        key={index}
                                        src={greenCar}
                                        alt="Available"
                                    />
                                ) : (
                                    <img
                                        key={index}
                                        src={redCar}
                                        alt="Unavailable"
                                    />
                                )
                            )}
                        </div>
                    </>
                ) : electricCharger ? (
                    <>
                        <h2>{electricCharger?.name}</h2>
                        <p>
                            <strong>Country:</strong>{" "}
                            {electricCharger?.countryName}
                        </p>
                        <p>
                            <strong>Latitude:</strong>{" "}
                            {electricCharger?.latitude}
                        </p>
                        <p>
                            <strong>Longitude:</strong>{" "}
                            {electricCharger?.longitude}
                        </p>
                        <p>
                            <strong>Charger Type:</strong>{" "}
                            {electricCharger?.chargerType}
                        </p>
                        <p>
                            <strong>Price:</strong> ${electricCharger?.price}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {electricCharger?.description}
                        </p>
                        <p>
                            <strong>Available Spots:</strong>{" "}
                            {electricCharger?.availableSpots}
                        </p>
                        <button
                            className={style.reserveButton}
                            onClick={() =>
                                onGoogleMaps(
                                    electricCharger.latitude,
                                    electricCharger.longitude
                                )
                            }
                        >
                            Google maps
                        </button>
                    </>
                ) : (
                    "Wrong path"
                )}
            </div>

            {isModalOpen && isGarageSpot && (
                <ReservationModal
                    onClose={() => setModalOpen(false)}
                    loading={loading}
                    onSubmit={(reservationData) => {
                        reserveGarageSpot(reservationData);
                        setModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default MapSidebar;
