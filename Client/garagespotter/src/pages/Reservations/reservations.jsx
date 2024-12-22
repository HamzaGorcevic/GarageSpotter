import React, { useState, useEffect, useContext } from "react";
import styles from "./reservations.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import GarageReservationTimer from "../../components/Garage/GarageTimer/garageTimer";
import ReservationModal from "../../components/Modals/ReservationModal/ReservationModal";
import toast from "react-hot-toast";
import ViewGarageModal from "../../components/Modals/ViewGarageModal/viewGarageModal";
import useExtendReservation from "../../hooks/ReservationHooks/seExtendReservation";
import { Loading } from "../../components/Loader/loader";
import { LucideCalendar, LucideTimer } from "lucide-react";
const Reservations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [garageSpot, setGarageSpot] = useState(null);
    const { authData } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [filter, setFilter] = useState("all");
    const [loadingWindow, setLoadingWindow] = useState(false);

    const getReservations = async () => {
        setLoadingWindow(true);
        const response = await fetch(
            `${BASE_URL}/Reservation/getUserReservations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        setLoadingWindow(false);
        const res = await response.json();
        console.log(res.value);
        setReservations(res?.value || []);
    };
    const { extendReservation, loading } =
        useExtendReservation(getReservations); // Pass getReservations for refreshing

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

    const onClose = () => {
        setIsModalOpen(false);
        setIsViewModalOpen(false);
    };

    const handleExtendSubmit = (newDetails) => {
        if (selectedReservation) {
            const reservation = {
                id: selectedReservation.id,
                singleSpotId: selectedReservation.singleSpotId,
                garageSpotId: selectedReservation.garageSpotId,
                ...newDetails,
            };
            extendReservation(reservation).then(() => {
                setIsModalOpen(false);
            });
        }
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

    return !loadingWindow ? (
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
                    <LucideTimer />
                    Hour-based Reservations
                </button>
                <button
                    className={`${styles.filterButton} ${
                        filter === "date" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("date")}
                >
                    <LucideCalendar />
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
                            {reservation.hours &&
                                reservation.hours !== 0 &&
                                !reservation.reservationEnd && (
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
                                className={`${styles.viewBtn}`}
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
                    onSubmit={handleExtendSubmit}
                    reservationData={selectedReservation}
                    isExtend={true}
                    loading={loading} // Optional: Indicate loading
                />
            )}

            {isViewModalOpen && garageSpot && (
                <ViewGarageModal garage={garageSpot} onClose={onClose} />
            )}
        </div>
    ) : (
        <Loading />
    );
};

export default Reservations;
