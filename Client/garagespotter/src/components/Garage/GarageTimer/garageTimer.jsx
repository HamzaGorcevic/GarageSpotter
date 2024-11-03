import React, { useEffect, useState } from "react";

const GarageReservationTimer = ({
    reservationStarted,
    hours,
    reservationStart,
    reservationEnd,
}) => {
    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        const isDefaultStart = reservationStart === "0001-01-01T00:00:00";
        const startTime = Date.parse(reservationStarted);
        const durationInMillis = hours * 60 * 60 * 1000;
        const reservationEndTime = startTime + durationInMillis;

        const validReservationStart = !isDefaultStart
            ? Date.parse(reservationStart)
            : null;
        const validReservationEnd = reservationEnd
            ? Date.parse(reservationEnd)
            : null;

        const interval = setInterval(() => {
            const now = new Date();
            let timeLeft;

            if (isDefaultStart) {
                timeLeft = reservationEndTime - now;
            } else if (validReservationStart && now >= validReservationStart) {
                timeLeft = validReservationEnd - now;
            } else {
                setTimeRemaining("Reservation has not started yet");
                return;
            }

            if (timeLeft > 0) {
                const yearsLeft = Math.floor(
                    timeLeft / (1000 * 60 * 60 * 24 * 365)
                );
                const monthsLeft = Math.floor(
                    (timeLeft % (1000 * 60 * 60 * 24 * 365)) /
                        (1000 * 60 * 60 * 24 * 30)
                );
                const daysLeft = Math.floor(
                    (timeLeft % (1000 * 60 * 60 * 24 * 30)) /
                        (1000 * 60 * 60 * 24)
                );
                const hoursLeft = Math.floor(
                    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutesLeft = Math.floor(
                    (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                );
                const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

                setTimeRemaining(
                    `${yearsLeft > 0 ? `${yearsLeft}y ` : ""}${
                        monthsLeft > 0 ? `${monthsLeft}mo ` : ""
                    }${daysLeft > 0 ? `${daysLeft}d ` : ""}${
                        hoursLeft > 0 ? `${hoursLeft}h ` : ""
                    }${minutesLeft > 0 ? `${minutesLeft}m ` : ""}${
                        secondsLeft > 0 ? `${secondsLeft}s` : ""
                    }`
                );
            } else {
                clearInterval(interval);
                setTimeRemaining("Reservation expired");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservationStarted, hours, reservationStart, reservationEnd]);

    return <div>Time left: {timeRemaining}</div>;
};

export default GarageReservationTimer;
