import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./mapsidebar.module.scss";
import LeftArrow from "../../../../assets/images/leftArrow.svg";
import redCar from "../../../../assets/images/redCar.png";
import greenCar from "../../../../assets/images/greenCar.png";
import ECharger from "../../../../assets/images/ECharger.png";
import { AuthContext } from "../../../../context/AuthContext";
import ReservationModal from "../../../../components/Modals/ReservationModal/ReservationModal.jsx";
import { BASE_URL } from "../../../../config/config.js";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
    MapPin,
    Star,
    Car,
    BatteryCharging,
    DollarSign,
    Info,
    Map,
    Home,
} from "lucide-react";
import useFavorites from "../../../../hooks/useFavorites.js";

const CHARGER_IMAGES = {
    "type-1":
        "https://www.iqlaad.com/wp-content/uploads/2020/12/Adapter-T1-T2-car-side.jpg",
    "type-2":
        "https://www.evexpert.eu/resize/e/1200/1200/files/products/adapter-t2-t1---t1-t2/adapter-typ-1-typ-2.png",
    chademo: "https://m.media-amazon.com/images/I/71qUQ+YPKKL.jpg",
    "ccs-combo-1":
        "https://m.media-amazon.com/images/I/71W57yjz6PL._AC_UF894,1000_QL80_.jpg",
    "ccs-combo-2":
        "https://evniculus.eu/cdn/shop/files/Untitleddesign_12.png?v=1693570974",
};

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
    const { favoriteSpots, refreshFavorites } = useFavorites(authData.token);
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
            const endpoint = `${BASE_URL}/User/addToFavorites?garageSpotId=${spotId}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();
            if (res.success) {
                toast.success("Successfuly added to favorites!");
                refreshFavorites();
            } else {
                toast.error(`Failed to add to favorites: ${res.message}`);
            }
        } catch (error) {
            toast.error("An error occurred while adding to favorites.");
            console.error("Error:", error);
        }
    };
    const isSpotInFavorites = (spotId) => {
        return favoriteSpots.some((spot) => spot.id === spotId);
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
                            <div style={{ position: "relative" }}>
                                <div className={style.imageSlider}>
                                    <button
                                        className={`${style.arrow} ${style.arrowLeft}`}
                                        onClick={() =>
                                            handleSliderMovement("left")
                                        }
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
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
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>

                                {isSpotInFavorites(garageSpot.id) ? (
                                    <button
                                        className={style.addToFavorites}
                                        onClick={() => {
                                            window.location.href = "/favorites";
                                        }}
                                    >
                                        <Star
                                            style={{
                                                color: "#FFD43B",
                                                fill: "#FFD43B",
                                            }}
                                        />
                                    </button>
                                ) : (
                                    <button
                                        className={style.addToFavorites}
                                        onClick={() =>
                                            addToFavorites(garageSpot.id)
                                        }
                                    >
                                        <Star style={{ color: "#FFD43B" }} />
                                    </button>
                                )}
                            </div>
                        )}
                        <h2>{garageSpot?.locationName}</h2>

                        <button
                            className={style.reserveButton}
                            onClick={() => setModalOpen(true)}
                        >
                            Reserve spot <Car />
                        </button>

                        <div className={style.contentDescription}>
                            <p>
                                <strong>
                                    <Home /> Address:
                                </strong>{" "}
                                {garageSpot?.address}
                            </p>
                            <p>
                                <strong>
                                    <BatteryCharging /> Available:
                                </strong>{" "}
                                {garageSpot?.isAvailable ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>
                                    <DollarSign /> Price:
                                </strong>{" "}
                                ${garageSpot?.price}
                            </p>
                            <p>
                                <strong>
                                    <MapPin /> Distance:
                                </strong>{" "}
                                {distance} km
                            </p>
                            <p>
                                <strong>
                                    <Car /> Total Spots:
                                </strong>{" "}
                                {garageSpot?.totalSpots.length}
                            </p>
                        </div>

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
                        <button
                            className={style.reserveButton}
                            style={{ background: "#1a73e8" }}
                            onClick={() =>
                                onGoogleMaps(
                                    garageSpot.latitude,
                                    garageSpot.longitude
                                )
                            }
                        >
                            Google maps <Map />
                        </button>
                    </>
                ) : electricCharger ? (
                    <>
                        <div style={{ position: "relative" }}>
                            <div className={style.imageSlider}>
                                <div className={style.imageContainer}>
                                    <img
                                        src={
                                            CHARGER_IMAGES[
                                                electricCharger?.chargerType
                                            ]
                                        }
                                        alt="Electric Charger"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <h2>{electricCharger?.name}</h2>

                        <div className={style.contentDescription}>
                            <p>
                                <strong>
                                    <Home /> Country:
                                </strong>{" "}
                                {electricCharger?.countryName}
                            </p>
                            <p>
                                <strong>
                                    <MapPin /> Location:
                                </strong>{" "}
                                {distance} km away
                            </p>
                            <p>
                                <strong>
                                    <BatteryCharging /> Type:
                                </strong>{" "}
                                {electricCharger?.chargerType}
                            </p>
                            <p>
                                <strong>
                                    <DollarSign /> Price:
                                </strong>{" "}
                                ${electricCharger?.price}
                            </p>
                            <p>
                                <strong>
                                    <Car /> Available:
                                </strong>{" "}
                                {electricCharger?.availableSpots} spots
                            </p>
                        </div>

                        <div className={style.containerForSpots}>
                            {Array.from({
                                length: electricCharger.availableSpots,
                            }).map((_, index) => (
                                <img
                                    key={index}
                                    src={ECharger}
                                    alt="Available Charger"
                                />
                            ))}
                        </div>

                        <div className={style.description}>
                            <p>
                                <strong>
                                    <Info /> Description:
                                </strong>{" "}
                                {electricCharger?.description}
                            </p>
                        </div>

                        <button
                            className={style.reserveButton}
                            style={{ background: "#1a73e8" }}
                            onClick={() =>
                                onGoogleMaps(
                                    electricCharger.latitude,
                                    electricCharger.longitude
                                )
                            }
                        >
                            Google maps <Map />
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
