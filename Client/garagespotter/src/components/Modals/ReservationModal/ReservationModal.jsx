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
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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

    const getCurrentDateTime = () => {
        return formatDate(new Date());
    };

    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

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

    const validateForm = () => {
        const newErrors = {};
        const todayDate = getTodayDate();

        if (reservationType === "hours") {
            const hoursNum = parseInt(hours);
            if (!hours || isNaN(hoursNum)) {
                newErrors.hours = "Please enter valid hours";
            } else if (hoursNum <= 0 || hoursNum >= 12) {
                newErrors.hours = "Hours must be between 1 and 12";
            }
        } else if (reservationType === "date") {
            if (!isExtend && !reservationStart) {
                newErrors.start = "Please select a start date";
            }
            if (!reservationEnd) {
                newErrors.end = "Please select an end date";
            }

            // Check if start date is before today
            if (reservationStart) {
                const startDate = new Date(reservationStart);
                startDate.setHours(0, 0, 0, 0);
                if (startDate < todayDate) {
                    newErrors.start = "Start date cannot be in the past";
                }
            }

            if (reservationStart && reservationEnd) {
                const startDate = new Date(reservationStart);
                const endDate = new Date(reservationEnd);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                const currentEnd = isExtend
                    ? reservationData?.reservationEnd
                        ? new Date(reservationData.reservationEnd)
                        : getCurrentEndTime()
                    : null;

                if (isExtend && currentEnd && endDate <= currentEnd) {
                    newErrors.end =
                        "New end date must be after current reservation end";
                } else if (endDate <= startDate) {
                    newErrors.end = "End date must be after start date";
                }

                const oneYearLater = new Date(startDate);
                oneYearLater.setFullYear(startDate.getFullYear() + 1);

                if (endDate > oneYearLater) {
                    newErrors.end = "Reservation period cannot exceed one year";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        const selectedDate = new Date(newStartDate);
        const todayDate = getTodayDate();

        selectedDate.setHours(0, 0, 0, 0);

        // Only set error if the field has been touched and is invalid
        if (selectedDate < todayDate) {
            setErrors((prev) => ({
                ...prev,
                start: "Start date cannot be in the past",
            }));
        } else {
            setErrors((prev) => {
                const { start, ...rest } = prev;
                return rest;
            });
        }

        setReservationStart(newStartDate);
        setTouched((prev) => ({ ...prev, start: true }));
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setReservationEnd(newEndDate);
        setTouched((prev) => ({ ...prev, end: true }));

        // Validate end date only if both dates are selected
        if (reservationStart) {
            const startDate = new Date(reservationStart);
            const endDate = new Date(newEndDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (endDate <= startDate) {
                setErrors((prev) => ({
                    ...prev,
                    end: "End date must be after start date",
                }));
            } else {
                setErrors((prev) => {
                    const { end, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handleHoursChange = (e) => {
        const value = e.target.value;
        const hoursNum = parseInt(value);

        setHours(value);
        setTouched((prev) => ({ ...prev, hours: true }));

        // Only validate if the field has been touched
        if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum >= 12) {
            setErrors((prev) => ({
                ...prev,
                hours: "Hours must be between 1 and 12",
            }));
        } else {
            setErrors((prev) => {
                const { hours, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleSubmit = () => {
        // Mark all fields as touched when submitting
        setTouched({
            hours: true,
            start: true,
            end: true,
        });

        // Validate all fields before submission
        if (!validateForm()) {
            toast.error("Please correct the errors before submitting");
            return;
        }

        if (reservationType === "hours") {
            const hoursNum = parseInt(hours);
            if (isExtend) {
                onSubmit({
                    hours: hoursNum,
                    reservationStarted: reservationData.reservationStarted,
                });
            } else {
                onSubmit({
                    hours: hoursNum,
                    reservationStarted: getCurrentDateTime(),
                });
            }
        } else if (reservationType === "date") {
            onSubmit({
                ...(reservationStart && { reservationStart }),
                reservationEnd,
                reservationStarted: isExtend
                    ? reservationData?.reservationStarted
                    : getCurrentDateTime(),
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
        setErrors({});
        setTouched({});
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
                        <div className={style.inputWrapper}>
                            <label>Additional Hours</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={handleHoursChange}
                                min={1}
                                max={11}
                                pattern="\d*"
                                inputMode="numeric"
                                placeholder="Enter hours to add"
                                className={
                                    touched.hours && errors.hours
                                        ? style.error
                                        : ""
                                }
                            />
                        </div>
                        {touched.hours && errors.hours && (
                            <div className={style.errorMessage}>
                                {errors.hours}
                            </div>
                        )}
                    </div>
                )}

                {reservationType === "date" && (
                    <>
                        {!isExtend && (
                            <div className={style.inputGroup}>
                                <div className={style.inputWrapper}>
                                    <label>Reservation Start</label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={reservationStart}
                                        onChange={handleStartDateChange}
                                        className={
                                            touched.start && errors.start
                                                ? style.error
                                                : ""
                                        }
                                    />
                                </div>
                                {touched.start && errors.start && (
                                    <div className={style.errorMessage}>
                                        {errors.start}
                                    </div>
                                )}
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
                            <div className={style.inputWrapper}>
                                <label>New End Date</label>
                                <input
                                    type="date"
                                    min={minReservationEndStr}
                                    value={reservationEnd}
                                    onChange={handleEndDateChange}
                                    className={
                                        touched.end && errors.end
                                            ? style.error
                                            : ""
                                    }
                                />
                            </div>
                            {touched.end && errors.end && (
                                <div className={style.errorMessage}>
                                    {errors.end}
                                </div>
                            )}
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
