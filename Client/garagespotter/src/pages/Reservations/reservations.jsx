import React, { useState, useEffect, useContext } from "react";
import styles from "./reservations.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import GarageReservationTimer from "../../components/Garage/GarageTimer/garageTimer";
import ReservationModal from "../../components/Modals/ReservationModal/ReservationModal";
import toast from "react-hot-toast";

const Reservations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setReservations(res?.value || []);
        console.log(res.value);
    };

    useEffect(() => {
        if (authData?.token) {
            getReservations();
        }
    }, [authData]);

    const extendReservation = async (reservation) => {
        try {
            await toast.promise(
                fetch(`${BASE_URL}/Reservation/extendReservation`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: reservation.id,
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
    };

    // Adjusted filter logic for reservations
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

            {/* Filter Options */}
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

            {/* Reservation List */}
            <div className={styles.reservationList}>
                {filteredReservations.length === 0 ? (
                    <p className={styles.noReservations}>
                        No reservations found.
                    </p>
                ) : (
                    filteredReservations.map((reservation) => (
                        <div
                            className={styles.reservationCard}
                            key={reservation.id} // Use `id` instead of `garageSpotId` as the key
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
                                className={styles.extendButton}
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setSelectedReservation(reservation);
                                }}
                            >
                                Extend Reservation
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
                />
            )}
        </div>
    );
};

export default Reservations;
