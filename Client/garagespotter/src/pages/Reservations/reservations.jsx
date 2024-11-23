import React, { useState, useEffect, useContext } from "react";
import styles from "./reservations.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import GarageReservationTimer from "../../components/Garage/GarageTimer/garageTimer";
import ReservationModal from "../../components/Modals/ReservationModal/ReservationModal";
import toast from "react-hot-toast";
import ViewGarageModal from "../../components/Modals/ViewGarageModal/viewGarageModal";

const Reservations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [garageSpot, setGarageSpot] = useState(null);
    const { authData } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [filter, setFilter] = useState("all");

    const getReservations = async () => {
        const response = await fetch(
            `${BASE_URL}/Reservation/getUserReservations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        const res = await response.json();
        console.log(res.value);
        setReservations(res?.value || []);
    };

    useEffect(() => {
        if (authData?.token) {
            getReservations();
        }
    }, [authData]);

    const getGarageSpot = async (garagespotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/garageSpot/getGarageSpot?garageSpotId=${garagespotId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            setGarageSpot(data.value);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error("Error fetching garage spot:", error);
        }
    };

    const extendReservation = async (reservation) => {
        console.log(reservation);
        try {
            await toast.promise(
                fetch(`${BASE_URL}/Reservation/extendReservation`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: selectedReservation.id,
                        ...reservation,
                    }),
                }),
                {
                    loading: "Extending reservation...",
                    success: "Reservation extended successfully!",
                    error: "Failed to extend reservation.",
                }
            );
            setIsModalOpen(false);
            getReservations();
        } catch (error) {
            console.error("Error extending reservation:", error);
        }
    };

    const onClose = () => {
        setIsModalOpen(false);
        setIsViewModalOpen(false);
    };

    const filteredReservations = reservations.filter((reservation) => {
        if (filter === "hours") {
            return reservation.hours !== 0 && !reservation.reservationStart;
        }
        if (filter === "date") {
            return reservation.reservationStart && !reservation.hours;
        }
        return true;
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Reservations</h1>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${
                        filter === "all" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("all")}
                >
                    All Reservations
                </button>
                <button
                    className={`${styles.filterButton} ${
                        filter === "hours" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("hours")}
                >
                    Hour-based Reservations
                </button>
                <button
                    className={`${styles.filterButton} ${
                        filter === "date" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("date")}
                >
                    Date-based Reservations
                </button>
            </div>

            <div className={styles.reservationList}>
                {filteredReservations.length === 0 ? (
                    <p className={styles.noReservations}>
                        No reservations found.
                    </p>
                ) : (
                    filteredReservations.map((reservation) => (
                        <div
                            className={styles.reservationCard}
                            key={reservation.id}
                        >
                            <h2 className={styles.spotId}>
                                Spot #{reservation.garageSpotId}
                            </h2>
                            {reservation.reservationStart && (
                                <p>
                                    <strong>Start:</strong>{" "}
                                    {new Date(
                                        reservation.reservationStart
                                    ).toLocaleString()}
                                </p>
                            )}
                            {reservation.reservationEnd && (
                                <p>
                                    <strong>End:</strong>{" "}
                                    {new Date(
                                        reservation.reservationEnd
                                    ).toLocaleString()}
                                </p>
                            )}
                            {reservation.hours && reservation.hours !== 0 && (
                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {reservation.hours} hour(s)
                                </p>
                            )}
                            <GarageReservationTimer
                                reservationStarted={
                                    reservation.reservationStarted
                                }
                                hours={reservation.hours}
                                reservationStart={reservation.reservationStart}
                                reservationEnd={reservation.reservationEnd}
                            />
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setSelectedReservation(reservation);
                                }}
                            >
                                Extend Reservation
                            </button>
                            <button
                                className={`${styles.viewBtn}`} // Add appropriate styling
                                onClick={() =>
                                    getGarageSpot(reservation.garageSpotId)
                                }
                            >
                                View
                            </button>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <ReservationModal
                    onClose={onClose}
                    onSubmit={extendReservation}
                    reservationData={selectedReservation}
                    isExtend={true}
                />
            )}

            {isViewModalOpen && garageSpot && (
                <ViewGarageModal garage={garageSpot} onClose={onClose} />
            )}
        </div>
    );
};

export default Reservations;
