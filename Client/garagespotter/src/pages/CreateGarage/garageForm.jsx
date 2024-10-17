import React, { useContext, useState } from "react";
import style from "./garageForm.module.scss"; // Import the SCSS module
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config/config";
const GarageForm = () => {
    const { authData } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        locationName: "",
        latitude: "",
        longitude: "",
        verificationDocument: null,
        numberOfSpots: "",
        price: "",
        garageImages: [],
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files[0],
        }));
    };

    const handleMultipleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            garageImages: Array.from(e.target.files),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("locationName", formData.locationName);
            formDataToSend.append("latitude", formData.latitude);
            formDataToSend.append("longitude", formData.longitude);
            formDataToSend.append(
                "verificationDocument",
                formData.verificationDocument
            );
            formDataToSend.append("numberOfSpots", formData.numberOfSpots);
            formDataToSend.append("price", formData.price);

            formData.garageImages.forEach((image) => {
                console.log("Hello world", image);
                formDataToSend.append(`garageImages`, image);
            });

            console.log("sd:+>", formDataToSend);
            const response = await fetch(
                `${BASE_URL}/GarageSpot/creategaragespot`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                    body: formDataToSend,
                }
            );

            if (response.ok) {
                alert("Garage spot created successfully");
            } else {
                const errorResponse = await response.text();
                setError("Failed to create garage spot: " + errorResponse);
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    return (
        <div className={style.registerContainer}>
            <h1 className={style.title}>Register Garage Spot</h1>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>Location Name:</label>
                    <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Latitude:</label>
                    <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Longitude:</label>
                    <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Number of Spots:</label>
                    <input
                        type="number"
                        name="numberOfSpots"
                        value={formData.numberOfSpots}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Garage Images:</label>
                    <input
                        type="file"
                        name="garageImages"
                        onChange={handleMultipleFileChange}
                        multiple
                        accept="image/*"
                    />
                </div>
                <div className={style.formGroup}>
                    <label>Verification Document:</label>
                    <input
                        type="file"
                        name="verificationDocument"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        required
                    />
                </div>

                {error && <p className={style.error}>{error}</p>}

                <button className={style.submitButton} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default GarageForm;
