import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./createElectricCharger.module.scss";
import MapConstant from "../Home/map/constants/constantMap";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";

const CreateElectricCharger = () => {
    const [latlng, setLatlng] = useState([43.23132, 21.21321]);
    const { authData } = useContext(AuthContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        verificationDocument: null,
        countryName: "",
        description: "",
        availableSpots: "",
        price: "",
        chargerType: "",
    });
    const [error, setError] = useState({});

    const scrollDown = () => {
        window.scrollTo({
            top: 900,
            behavior: "smooth",
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setError((prevError) => ({ ...prevError, [name]: "" })); // Clear error when user changes input
    };

    const fetchGarageSpot = async (garageSpotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/getElectricChargerById?id=${garageSpotId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            if (response.ok) {
                let data = await response.json();
                data = data.value;
                setFormData({
                    name: data.name,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    countryName: data.countryName,
                    verificationDocument: data.verificationDocument,
                    description: data.description || "",
                    availableSpots: data.availableSpots || "",
                    price: data.price || "",
                    chargerType: data.chargerType || "",
                });
            } else {
                setError({ general: "Failed to fetch garage spot details." });
            }
        } catch (error) {
            setError({ general: "Error: " + error.message });
        }
    };

    useEffect(() => {
        if (id && authData.token) {
            setIsUpdateMode(true);
            fetchGarageSpot(id);
        }
    }, [id, authData]);

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            latitude: latlng[0],
            longitude: latlng[1],
        }));
        getcountryNameFromCoordinates(latlng[0], latlng[1]);
    }, [latlng]);

    const getcountryNameFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const res = await response.json();
            const countryName = res.address.country || "Unknown country";
            setError((prevError) => ({ ...prevError, countryName: "" }));
            setFormData((prevState) => ({
                ...prevState,
                countryName,
            }));
        } catch (error) {
            console.error("Error fetching country name:", error);
            setError({ general: "Failed to retrieve country name" });
            toast.error("Failed to retrieve country name!");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            verificationDocument: file,
        }));
        setError((prevError) => ({ ...prevError, verificationDocument: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "name",
            "latitude",
            "longitude",
            "availableSpots",
            "chargerType",
        ];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = "This field is required.";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            toast.error("Please fill in all required fields.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append(
            "verificationDocument",
            formData.verificationDocument
        );
        formDataToSend.append("name", formData.name);
        formDataToSend.append("latitude", formData.latitude);
        formDataToSend.append("longitude", formData.longitude);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("availableSpots", formData.availableSpots);
        formDataToSend.append("countryName", formData.countryName);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("chargerType", formData.chargerType);

        const apiUrl = isUpdateMode
            ? `/ElectricCharger/updateElectricCharger?electricChargerId=${id}`
            : `/ElectricCharger/createElectricCharger`;

        const httpMethod = isUpdateMode ? "PUT" : "POST";

        const successMessage = isUpdateMode
            ? "Electric charger updated successfully!"
            : "Electric charger created successfully!";

        const errorMessage = isUpdateMode
            ? "Error updating electric charger:"
            : "Error creating electric charger:";

        try {
            setLoading(true);

            const response = await fetch(BASE_URL + apiUrl, {
                method: httpMethod,
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();
            setLoading(false);
            if (data.success) {
                toast.success(successMessage);
                console.log(successMessage, data);
            } else {
                console.error(errorMessage, data.message);
                toast.error(`${errorMessage} ${data.message}`);
            }
        } catch (error) {
            console.error("Request failed:", error);
            toast.error("Request failed: " + error.message);
        }
    };

    return (
        <div className={styles.createElectricChargerContainer}>
            <h2 className={styles.title}>Create Electric Charger</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {error.name && (
                        <p className={styles.errorMessage}>{error.name}</p>
                    )}
                </div>
                <div className={styles.formGroup} onClick={scrollDown}>
                    <label htmlFor="countryName">Country Name:</label>
                    <input
                        type="text"
                        id="countryName"
                        name="countryName"
                        value={formData.countryName}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className={styles.formGroup} onClick={scrollDown}>
                    <label htmlFor="latitude">Latitude:</label>
                    <input
                        disabled
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                    />
                    {error.latitude && (
                        <p className={styles.errorMessage}>{error.latitude}</p>
                    )}
                </div>
                <div className={styles.formGroup} onClick={scrollDown}>
                    <label htmlFor="longitude">Longitude:</label>
                    <input
                        disabled
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                    />
                    {error.longitude && (
                        <p className={styles.errorMessage}>{error.longitude}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        min={1}
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="availableSpots">Available Spots:</label>
                    <input
                        type="number"
                        min={1}
                        id="availableSpots"
                        name="availableSpots"
                        value={formData.availableSpots}
                        onChange={handleChange}
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
                        <option value="type-1">Type 1</option>
                        <option value="type-2">Type 2</option>
                        <option value="chademo">CHAdeMO</option>
                        <option value="ccs-combo-1">CCS Combo Type 1</option>
                        <option value="ccs-combo-2">CCS Combo Type 2</option>
                    </select>
                    {error.chargerType && (
                        <p className={styles.errorMessage}>
                            {error.chargerType}
                        </p>
                    )}
                </div>

                <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Loading..."
                        : isUpdateMode
                        ? "Update Charger"
                        : "Create Charger"}
                </button>
                {error.general && (
                    <p className={styles.errorMessage}>{error.general}</p>
                )}
            </form>
            <MapConstant setLatlng={setLatlng} />
        </div>
    );
};

export default CreateElectricCharger;
