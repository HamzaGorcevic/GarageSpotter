import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./mapsidebar.module.scss";
import LeftArrow from "../../../../assets/images/leftArrow.svg";
import redCar from "../../../../assets/images/redCar.png";
import greenCar from "../../../../assets/images/greenCar.png";
import { AuthContext } from "../../../../context/AuthContext";
import ReservationModal from "../../../../components/Modals/ReservationModal/ReservationModal.jsx";
import { BASE_URL } from "../../../../config/config.js";
import toast from "react-hot-toast";

const MapSidebar = ({ isOpen, onClose, garageSpotId, distance }) => {
    const { authData } = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [garageSpot, setGarageSpot] = useState(null);
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
            `${BASE_URL}/Reservation/reserveSingleSpot  `,
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
        toast.success("Succesfully reserved garage spot !");
        fetchGarageSpot();
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
    useEffect(() => {
        if (garageSpotId >= 0) {
            fetchGarageSpot();
        }
    }, [garageSpotId]);

    return (
        <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
            <div className={style.sidebarHeader}>
                <button className={style.closeButton} onClick={onClose}>
                    <img src={LeftArrow} alt="Close" />
                </button>
            </div>
            <div className={style.sidebarContent}>
                {garageSpot?.garageImages?.length > 0 && (
                    <div className={style.imageSlider}>
                        <button
                            className={`${style.arrow} ${style.arrowLeft}`}
                            onClick={() => handleSliderMovement("left")}
                        >
                            &lt;
                        </button>
                        <div className={style.imageContainer} ref={sliderRef}>
                            {garageSpot.garageImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Garage Image ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            className={`${style.arrow} ${style.arrowRight}`}
                            onClick={() => handleSliderMovement("right")}
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
                    {garageSpot?.totalSpots?.map((spot) =>
                        spot.isAvailable ? (
                            <img src={greenCar} alt="Available" />
                        ) : (
                            <img src={redCar} alt="Unavailable" />
                        )
                    )}
                </div>
            </div>

            {isModalOpen && (
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
