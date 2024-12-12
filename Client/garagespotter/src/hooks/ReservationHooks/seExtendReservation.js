import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";

const useExtendReservation = (getReservations) => {
    const [loading, setLoading] = useState(false);
    const { authData } = useContext(AuthContext);
    const extendReservation = async (reservation) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/Reservation/extendReservation`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reservation),
                }
            );

            const res = await response.json();
            setLoading(false);

            if (response.ok && res.success) {
                toast.success(
                    res.message || "Reservation extended successfully!"
                );
                getReservations();
            } else {
                toast.error(res.message || "Failed to extend reservation.");
            }
        } catch (error) {
            setLoading(false);
            toast.error(
                "An error occurred while extending the reservation. Please try again."
            );
            console.error("Extend reservation error:", error);
        }
    };

    return { extendReservation, loading };
};

export default useExtendReservation;
