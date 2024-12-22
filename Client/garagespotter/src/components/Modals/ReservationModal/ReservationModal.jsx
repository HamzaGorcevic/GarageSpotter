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

    // Custom function to get current date string in YYYY-MM-DD format
    const formatDate = (date) => {
        let currentTime = date || new Date();
        const year = currentTime.getFullYear();
        const month = String(currentTime.getMonth() + 1).padStart(2, "0");
        const day = String(currentTime.getDate()).padStart(2, "0");
        const hh = String(currentTime.getHours()).padStart(2, "0");
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentTime.getSeconds()).padStart(2, "0");
        const localISOString = `${year}-${month}-${day}T${hh}:${minutes}:${seconds}`;
        return localISOString;
    };

    // Custom function to get current datetime string
    const getCurrentDateTime = () => {
        let currentTime = new Date();
        const year = currentTime.getFullYear();
        const month = String(currentTime.getMonth() + 1).padStart(2, "0");
        const day = String(currentTime.getDate()).padStart(2, "0");
        const hh = String(currentTime.getHours()).padStart(2, "0");
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentTime.getSeconds()).padStart(2, "0");
        const localISOString = `${year}-${month}-${day}T${hh}:${minutes}:${seconds}`;
        return localISOString;
    };

    // Get today's date at midnight for consistent comparison
    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    // For hour-based reservations, calculate the current end time
    const getCurrentEndTime = () => {
        if (!reservationData?.reservationStarted || !reservationData?.hours) {
            return new Date();
        }
        const startTime = new Date(reservationData.reservationStarted);
        return new Date(
            startTime.getTime() + reservationData.hours * 60 * 60 * 1000
        );
    };

    const today = formatDate(getTodayDate());

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        const selectedDate = new Date(newStartDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (isExtend) {
            const currentEnd = reservationData?.reservationEnd
                ? new Date(reservationData.reservationEnd)
                : getCurrentEndTime();

            if (selectedDate < currentEnd) {
                toast.error("Start date must be after current reservation end");
                setReservationStart("");
                return;
            }
        } else if (selectedDate < getTodayDate()) {
            toast.error("Start date cannot be in the past");
            setReservationStart("");
            return;
        }

        setReservationStart(newStartDate);

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

        if (isExtend) {
            const currentEnd = reservationData?.reservationEnd
                ? new Date(reservationData.reservationEnd)
                : getCurrentEndTime();

            if (endDate <= currentEnd) {
                toast.error(
                    "New end date must be after current reservation end"
                );
                setReservationEnd("");
                return;
            }
        }

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
        if (reservationType === "hours") {
            const hoursNum = parseInt(hours);
            if (hoursNum <= 0 || hoursNum >= 12) {
                toast.error("Hours must be between 1 and 12");
                return;
            }

            // For hour-based extension, use only the new hours value
            if (isExtend) {
                onSubmit({
                    hours: hoursNum, // Use only the new hours value
                    reservationStarted: reservationData.reservationStarted,
                });
            } else {
                onSubmit({
                    hours: hoursNum,
                    reservationStarted: getCurrentDateTime(), // Use custom datetime string
                });
            }
        } else if (reservationType === "date") {
            if (!reservationEnd) {
                toast.error("Please select an end date");
                return;
            }

            if (isExtend) {
                const currentEnd = reservationData?.reservationEnd
                    ? new Date(reservationData.reservationEnd)
                    : getCurrentEndTime();

                const newEnd = new Date(reservationEnd);

                if (newEnd <= currentEnd) {
                    toast.error(
                        "New end date must be after current reservation end"
                    );
                    return;
                }
            }

            onSubmit({
                ...(reservationStart && { reservationStart }),
                reservationEnd,
                reservationStarted: isExtend
                    ? reservationData?.reservationStarted
                    : getCurrentDateTime(), // Use custom datetime string
                hours: null,
            });
        }
    };

    const getMinReservationEnd = () => {
        if (isExtend) {
            if (reservationData?.reservationEnd) {
                return new Date(reservationData.reservationEnd);
            } else if (reservationData?.hours) {
                const currentEnd = getCurrentEndTime();
                return new Date(currentEnd.setDate(currentEnd.getDate() + 1));
            }
        }
        return reservationStart
            ? new Date(
                  new Date(reservationStart).setDate(
                      new Date(reservationStart).getDate() + 1
                  )
              )
            : new Date(new Date(today).setDate(new Date(today).getDate() + 1));
    };

    const minReservationEndStr = formatDate(getMinReservationEnd());

    useEffect(() => {
        setReservationEnd("");
    }, [reservationType]);

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>{isExtend ? "Extend Reservation" : "Reserve a Spot"}</h2>

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
                        {isExtend ? "Extend by End Date" : "Reserve by Date"}
                    </label>
                </div>

                {reservationType === "hours" && (
                    <div className={style.inputGroup}>
                        {isExtend && reservationData?.hours && (
                            <div className={style.currentInfo}>
                                Current Hours: {reservationData.hours}
                            </div>
                        )}
                        <label>Additional Hours</label>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            min={1}
                            max={11}
                            pattern="\d*"
                            inputMode="numeric"
                            placeholder="Enter hours to add"
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
                                />
                            </div>
                        )}

                        <div className={style.inputGroup}>
                            {isExtend && (
                                <div className={style.currentInfo}>
                                    Current End:{" "}
                                    {reservationData?.reservationEnd
                                        ? new Date(
                                              reservationData.reservationEnd
                                          ).toLocaleDateString()
                                        : getCurrentEndTime().toLocaleDateString()}
                                </div>
                            )}
                            <label>New End Date</label>
                            <input
                                type="date"
                                min={minReservationEndStr}
                                value={reservationEnd}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </>
                )}

                <div className={style.buttonGroup}>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? "Loading..."
                            : isExtend
                            ? "Confirm Extension"
                            : "Confirm Reservation"}
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
