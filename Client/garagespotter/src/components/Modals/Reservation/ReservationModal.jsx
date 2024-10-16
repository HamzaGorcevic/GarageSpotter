import React, { useState } from "react";
import style from "./reservationsmodal.module.scss";

const ReservationModal = ({ onClose, onSubmit }) => {
    const [reservationStart, setReservationStart] = useState("");
    const [reservationEnd, setReservationEnd] = useState("");
    const [hours, setHours] = useState(1);

    const handleSubmit = () => {
        if (reservationStart && reservationEnd && hours > 0) {
            let intHours = parseInt(hours);
            onSubmit({ reservationStart, reservationEnd, intHours });
        }
    };

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>Reserve a Spot</h2>
                <div className={style.inputGroup}>
                    <label>Reservation Start</label>
                    <input
                        type="datetime-local"
                        value={reservationStart}
                        onChange={(e) => setReservationStart(e.target.value)}
                    />
                </div>

                <div className={style.inputGroup}>
                    <label>Reservation End</label>
                    <input
                        type="datetime-local"
                        value={reservationEnd}
                        onChange={(e) => setReservationEnd(e.target.value)}
                    />
                </div>

                <div className={style.inputGroup}>
                    <label>Hours</label>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        min={1}
                    />
                </div>

                <div className={style.buttonGroup}>
                    <button onClick={handleSubmit}>Confirm Reservation</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
