import React, { useState, useEffect, useContext } from "react";
import styles from "./reservations.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
const Reservations = () => {
    const { authData } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);

    const getReservatons = async () => {
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
        setReservations(res?.value);
    };
    useEffect(() => {
        getReservatons();
    }, []);

    const extendReservation = (garageSpotId) => {
        // Logic to extend reservation
        console.log("Extend reservation for spot:", garageSpotId);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Reservations</h1>
            <div className={styles.reservationList}>
                {reservations.length === 0 ? (
                    <p className={styles.noReservations}>
                        No reservations found.
                    </p>
                ) : (
                    reservations.map((reservation) => (
                        <div
                            className={styles.reservationCard}
                            key={reservation.garageSpotId}
                        >
                            <h2 className={styles.spotId}>
                                Spot #{reservation.garageSpotId}
                            </h2>
                            <p>
                                <strong>Start:</strong>{" "}
                                {new Date(
                                    reservation.reservationStart
                                ).toLocaleString()}
                            </p>
                            <p>
                                <strong>End:</strong>{" "}
                                {new Date(
                                    reservation.reservationEnd
                                ).toLocaleString()}
                            </p>
                            <p>
                                <strong>Duration:</strong> {reservation.hours}{" "}
                                hour(s)
                            </p>
                            <button
                                className={styles.extendButton}
                                onClick={() =>
                                    extendReservation(reservation.garageSpotId)
                                }
                            >
                                Extend Reservation
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reservations;
