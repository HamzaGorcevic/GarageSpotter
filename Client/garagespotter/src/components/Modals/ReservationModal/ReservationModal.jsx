import React, { useState, useEffect } from "react";
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

    // Get today's date at midnight for consistent comparison
    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const today = getTodayDate().toISOString().split("T")[0];

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        const selectedDate = new Date(newStartDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < getTodayDate()) {
            toast.error("Start date cannot be in the past");
            setReservationStart("");
            return;
        }

        setReservationStart(newStartDate);

        // Clear end date if it's before or equal to the new start date
        if (
            reservationEnd &&
            new Date(reservationEnd) <= new Date(newStartDate)
        ) {
            setReservationEnd("");
            toast.error("End date must be after start date");
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        const startDate = new Date(reservationStart || today);
        const endDate = new Date(newEndDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (endDate <= startDate) {
            toast.error("End date must be after start date");
            setReservationEnd("");
            return;
        }

        const oneYearLater = new Date(startDate);
        oneYearLater.setFullYear(startDate.getFullYear() + 1);

        if (endDate > oneYearLater) {
            toast.error("Reservation period cannot exceed one year");
            setReservationEnd("");
            return;
        }

        setReservationEnd(newEndDate);
    };

    const handleSubmit = () => {
        const currentTime = new Date();
        const localISOString = currentTime.toISOString().split(".")[0];

        if (reservationType === "hours") {
            const hoursNum = parseInt(hours);
            if (hoursNum <= 0 || hoursNum >= 12) {
                toast.error("Hours must be between 1 and 12");
                return;
            }
            onSubmit({
                hours: hoursNum,
                reservationStarted: localISOString,
            });
        } else if (reservationType === "date") {
            if (!reservationEnd) {
                toast.error("Please select an end date");
                return;
            }

            const startDate = new Date(reservationStart || today);
            const endDate = new Date(reservationEnd);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (startDate < getTodayDate()) {
                toast.error("Start date cannot be in the past");
                return;
            }

            if (endDate <= startDate) {
                toast.error("End date must be after start date");
                return;
            }

            onSubmit({
                ...(reservationStart && { reservationStart }),
                reservationEnd,
                reservationStarted: localISOString,
            });
        }
    };

    const minReservationEnd = reservationStart
        ? new Date(
              new Date(reservationStart).setDate(
                  new Date(reservationStart).getDate() + 1
              )
          )
        : new Date(new Date(today).setDate(new Date(today).getDate() + 1));

    const minReservationEndStr = minReservationEnd.toISOString().split("T")[0];

    useEffect(() => {
        setReservationEnd("");
    }, [reservationType]);

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
                            max={11}
                            pattern="\d*"
                            inputMode="numeric"
                        />
                    </div>
                )}

                {reservationType === "date" && (
                    <>
                        {!isExtend && (
                            <div className={style.inputGroup}>
                                <label>Reservation Start</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={reservationStart}
                                    onChange={handleStartDateChange}
                                    onInvalid={(e) => {
                                        e.preventDefault();
                                        toast.error(
                                            "Please select a valid start date"
                                        );
                                    }}
                                />
                            </div>
                        )}

                        <div className={style.inputGroup}>
                            <label>Reservation End</label>
                            <input
                                type="date"
                                min={minReservationEndStr}
                                value={reservationEnd}
                                onChange={handleEndDateChange}
                                onInvalid={(e) => {
                                    e.preventDefault();
                                    toast.error(
                                        "Please select a valid end date"
                                    );
                                }}
                            />
                        </div>
                    </>
                )}

                <div className={style.buttonGroup}>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Loading..." : "Confirm Reservation"}
                    </button>
                    <button onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
