import React, { useState } from "react";
import style from "./reservationsmodal.module.scss";
import toast from "react-hot-toast";

const ReservationModal = ({
    onClose,
    onSubmit,
    reservationData = null,
    loading = false,
    isExtend = false,
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

        const localISOString = `${year}-${month}-${day}T${hh}:${minutes}:${seconds}`;

        if (reservationType === "hours") {
            if (parseInt(hours) <= 0 || parseInt(hours) >= 12) {
                console.log("WTF", hours);
                toast.error("Hours must be between 0 and 12");
                return;
            }
            onSubmit({
                hours: parseInt(hours),
                reservationStarted: localISOString,
            });
        } else if (reservationType === "date") {
            if ((reservationStart && reservationEnd) || reservationEnd) {
                if (new Date(reservationStart) > new Date(reservationEnd)) {
                    toast.error("Please input correct date ");
                    return;
                }
                if (reservationStart && reservationEnd) {
                    const startDate = new Date(reservationStart);
                    const endDate = new Date(reservationEnd);
                    const oneYearLater = new Date(startDate);
                    oneYearLater.setFullYear(startDate.getFullYear() + 1);

                    if (endDate > oneYearLater) {
                        toast.error(
                            "Reservation period cannot exceed one year."
                        );
                        return;
                    }
                }

                if (reservationStart) {
                    onSubmit({
                        reservationStart,
                        reservationEnd,
                        reservationStarted: localISOString,
                    });
                } else {
                    onSubmit({
                        reservationEnd,
                        reservationStarted: localISOString,
                    });
                }
            }
        }
    };

    const today = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0];

    let minReservationEnd = reservationStart
        ? new Date(reservationStart)
        : new Date(today);

    minReservationEnd.setDate(minReservationEnd.getDate() + 1);
    const minReservationEndStr = minReservationEnd.toISOString().split("T")[0];

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
                        {isExtend ? "Extend by Hours" : "Reserve by Hours"}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="reservationType"
                            value="date"
                            checked={reservationType === "date"}
                            onChange={() => setReservationType("date")}
                        />
                        {isExtend ? "Extend by end-date" : "Reserve by Date"}
                    </label>
                </div>

                {reservationType === "hours" && (
                    <div className={style.inputGroup}>
                        <label></label>
                        <input
                            placeholder="Hours"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            min={1}
                            max={12}
                        />
                    </div>
                )}

                {reservationType === "date" && (
                    <>
                        {isExtend ? (
                            ""
                        ) : (
                            <div className={style.inputGroup}>
                                <label>Reservation Start</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={reservationStart}
                                    onChange={(e) =>
                                        setReservationStart(e.target.value)
                                    }
                                />
                            </div>
                        )}

                        <div className={style.inputGroup}>
                            <label>Reservation End</label>
                            <input
                                type="date"
                                min={minReservationEndStr}
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
