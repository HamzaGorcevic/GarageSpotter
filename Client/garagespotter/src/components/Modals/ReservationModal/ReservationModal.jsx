import React, { useState } from "react";
import style from "./reservationsmodal.module.scss";

const ReservationModal = ({
    onClose,
    onSubmit,
    reservationData = null,
    loading = false,
}) => {
    const [reservationType, setReservationType] = useState("hours");

    const [reservationStart, setReservationStart] = useState(
        reservationData?.reservationStart || ""
    );
    const [reservationEnd, setReservationEnd] = useState(
        reservationData?.reservationEnd || ""
    );
    const [hours, setHours] = useState(reservationData?.hours || "");

    const handleSubmit = () => {
        let currentTime = new Date();
        const year = currentTime.getFullYear();
        const month = String(currentTime.getMonth() + 1).padStart(2, "0");
        const day = String(currentTime.getDate()).padStart(2, "0");
        const hh = String(currentTime.getHours()).padStart(2, "0");
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentTime.getSeconds()).padStart(2, "0");
        const milliseconds = String(currentTime.getMilliseconds()).padStart(
            3,
            "0"
        );

        const localISOString = `${year}-${month}-${day}T${hh}:${minutes}:${seconds}.${milliseconds}`;

        // Validation for the selected reservation type
        if (reservationType === "hours" && hours > 0) {
            onSubmit({
                hours: parseInt(hours),
                reservationStarted: localISOString,
            });
        } else if (
            reservationType === "date" &&
            reservationStart &&
            reservationEnd
        ) {
            onSubmit({
                reservationStart,
                reservationEnd,
                reservationStarted: localISOString,
            });
        }
    };

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>Reserve a Spot</h2>

                <div className={style.toggleGroup}>
                    <label>
                        <input
                            type="radio"
                            name="reservationType"
                            value="hours"
                            checked={reservationType === "hours"}
                            onChange={() => setReservationType("hours")}
                        />
                        Reserve by Hours
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="reservationType"
                            value="date"
                            checked={reservationType === "date"}
                            onChange={() => setReservationType("date")}
                        />
                        Reserve by Date
                    </label>
                </div>

                {reservationType === "hours" && (
                    <div className={style.inputGroup}>
                        <label>Hours</label>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            min={1}
                        />
                    </div>
                )}

                {reservationType === "date" && (
                    <>
                        <div className={style.inputGroup}>
                            <label>Reservation Start</label>
                            <input
                                type="date"
                                value={reservationStart}
                                onChange={(e) =>
                                    setReservationStart(e.target.value)
                                }
                            />
                        </div>

                        <div className={style.inputGroup}>
                            <label>Reservation End</label>
                            <input
                                type="date"
                                value={reservationEnd}
                                onChange={(e) =>
                                    setReservationEnd(e.target.value)
                                }
                            />
                        </div>
                    </>
                )}

                <div className={style.buttonGroup}>
                    {!loading ? (
                        <button onClick={handleSubmit}>
                            Confirm Reservation
                        </button>
                    ) : (
                        <button disabled>Loading</button>
                    )}
                    {!loading ? (
                        <button onClick={onClose}>Cancel</button>
                    ) : (
                        <button disabled>Loading ...</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
