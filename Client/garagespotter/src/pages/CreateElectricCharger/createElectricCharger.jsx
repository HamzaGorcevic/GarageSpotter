import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./createElectricCharger.module.scss";
import MapConstant from "../Home/map/constants/constantMap";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../config/config";
// Charger type options
const CHARGER_TYPES = [
    { value: "type-1", label: "Type 1" },
    { value: "type-2", label: "Type 2" },
    { value: "chademo", label: "CHAdeMO" },
    { value: "ccs-combo-1", label: "CCS Combo Type 1" },
    { value: "ccs-combo-2", label: "CCS Combo Type 2" },
];

const CreateElectricCharger = () => {
    const [latlng, setLatlng] = useState([43.23132, 21.21321]);
    const { authData, updateToken } = useContext(AuthContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        latitude: latlng[0],
        longitude: latlng[1],
        verificationDocument: null,
        countryName: "",
        description: "",
        availableSpots: "",
        price: "",
        chargerType: "",
    });

    useEffect(() => {
        if (id && authData.token) {
            setIsUpdateMode(true);
            fetchChargerData();
        }
    }, [id, authData]);

    const fetchChargerData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/getElectricChargerById?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    name: data.value.name,
                    latitude: data.value.latitude,
                    longitude: data.value.longitude,
                    countryName: data.value.countryName,
                    verificationDocument: data.value.verificationDocument,
                    description: data.value.description || "",
                    availableSpots: data.value.availableSpots || "",
                    price: data.value.price || "",
                    chargerType: data.value.chargerType || "",
                });
            } else {
                setError({ general: "Failed to fetch charger details" });
                toast.error("Failed to fetch charger details");
            }
        } catch (error) {
            setError({ general: "Error fetching charger details" });
            toast.error("Error fetching charger details");
        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            latitude: latlng[0],
            longitude: latlng[1],
        }));
        updateCountryName();
    }, [latlng]);

    const updateCountryName = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json&accept-language=en`
            );
            const data = await response.json();
            const countryName = data.address.country || "Unknown country";
            setFormData((prev) => ({ ...prev, countryName }));
        } catch (error) {
            toast.error("Failed to retrieve country name");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                verificationDocument: file,
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = ["name", "availableSpots", "chargerType"];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });

        if (Number(formData.availableSpots)) {
            if (formData.availableSpots < 1) {
                errors.availableSpots = "Must have at least 1 available spot";
            }
            if (formData.availableSpots > 20) {
                errors.availableSpots =
                    "Must have less than 20 spots, since we are in beta phase";
            }
        }
        if (Number(formData.price)) {
            if (formData.price < 0) {
                errors.price = "Price cannot be negative";
            }
            if (formData.price > 1000) {
                errors.price = "Price cannot be higher than 1000";
            }
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const scrollDown = () => {
        window.scrollTo({ top: 900, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        try {
            setLoading(true);
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            const url = isUpdateMode
                ? `${BASE_URL}/ElectricCharger/updateElectricCharger?electricChargerId=${id}`
                : `${BASE_URL}/ElectricCharger/createElectricCharger`;

            const response = await fetch(url, {
                method: isUpdateMode ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    isUpdateMode
                        ? "Electric charger updated successfully!"
                        : "Electric charger created successfully!"
                );
                if (result.value?.length > 1) {
                    updateToken(result.value);
                }
            } else {
                throw new Error(result.message || "Operation failed");
            }
        } catch (error) {
            toast.error(error.message || "Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createElectricChargerContainer}>
            <h2 className={styles.title}>
                {isUpdateMode
                    ? "Update Electric Charger"
                    : "Create Electric Charger"}
            </h2>

            <div className={styles.mapSection}>
                <div className={styles.mapInstructions}>
                    <h3>
                        <MapPin size={20} />
                        Select Location
                    </h3>
                    <p>
                        Click anywhere on the map to select your charger
                        location. This will automatically update the country and
                        coordinates.
                    </p>
                </div>

                <MapConstant setLatlng={setLatlng} />

                <div className={styles.locationInfo}>
                    <div className={styles.infoItem}>
                        <label>Country</label>
                        <span>{formData.countryName || "Not selected"}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <label>Latitude</label>
                        <span>{Number(formData.latitude).toFixed(6)}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <label>Longitude</label>
                        <span>{Number(formData.longitude).toFixed(6)}</span>
                    </div>
                </div>

                <ChevronDown
                    className={styles.scrollArrow}
                    onClick={scrollDown}
                />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter charger name"
                    />
                    {error.name && (
                        <p className={styles.errorMessage}>{error.name}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your charging station"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        max="1000"
                        placeholder="Enter price per charge"
                    />
                    {error.price && (
                        <p className={styles.errorMessage}>{error.price}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="availableSpots">Available Spots:</label>
                    <input
                        type="number"
                        id="availableSpots"
                        name="availableSpots"
                        value={formData.availableSpots}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        placeholder="Number of charging spots"
                    />
                    {error.availableSpots && (
                        <p className={styles.errorMessage}>
                            {error.availableSpots}
                        </p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="verificationDocument">
                        Verification Document:
                    </label>
                    <input
                        type="file"
                        id="verificationDocument"
                        name="verificationDocument"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="chargerType">Charger Type:</label>
                    <select
                        id="chargerType"
                        name="chargerType"
                        value={formData.chargerType}
                        onChange={handleChange}
                    >
                        <option value="">Select a charger type</option>
                        {CHARGER_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {error.chargerType && (
                        <p className={styles.errorMessage}>
                            {error.chargerType}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className={styles.loadingSpinner} />
                            <span>Saving...</span>
                        </>
                    ) : isUpdateMode ? (
                        "Update Charger"
                    ) : (
                        "Create Charger"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateElectricCharger;
