import React, { useContext, useEffect, useState } from "react";
import style from "./garageForm.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config/config";
import MapConstant from "../Home/map/constants/constantMap";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, ChevronDown } from "lucide-react";

const GarageForm = () => {
    const [latlng, setLatlng] = useState([43.23132, 21.21321]);
    const [areFilesValid, setAreFilesValid] = useState(true);
    const [error, setError] = useState("");
    const { authData, updateToken } = useContext(AuthContext);
    const { id } = useParams();
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        locationName: "",
        latitude: latlng[0],
        longitude: latlng[1],
        countryName: "",
        verificationDocument: null,
        numberOfSpots: "",
        price: "",
        garageImages: [],
    });

    useEffect(() => {
        if (id && authData.token) {
            setIsUpdateMode(true);
            fetchGarageSpot(id);
        }
    }, [id, authData]);

    const fetchGarageSpot = async (garageSpotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/GarageSpot/getGarageSpot?garageSpotId=${garageSpotId}`,
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
                    locationName: data.locationName,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    countryName: data.countryName,
                    verificationDocument: data.verificationDocument,
                    numberOfSpots: data.totalSpots?.length,
                    price: data.price,
                    garageImages: data.garageImages,
                });
            } else {
                setError("Failed to fetch garage spot details.");
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

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
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
            );
            const res = await response.json();
            const countryName = res.address.country || "Unknown country";
            setError("");
            setFormData((prevState) => ({
                ...prevState,
                countryName,
            }));
        } catch (error) {
            console.error("Error fetching countryName:", error);
            setError("Failed to retrieve country name");
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files[0],
        }));
    };

    const handleMultipleFileChange = (e) => {
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        const selectedFiles = Array.from(e.target.files);

        const filteredFiles = selectedFiles.filter((file) =>
            validImageTypes.includes(file.type)
        );

        if (filteredFiles.length + formData.garageImages.length > 7) {
            toast.error("You can only upload a maximum of 7 images.");
            setAreFilesValid(false);
            return;
        }

        setAreFilesValid(true);

        setFormData((prevState) => ({
            ...prevState,
            garageImages: [...prevState.garageImages, ...filteredFiles],
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.locationName) {
            errors.locationName = "Location name is required";
        }
        if (formData.numberOfSpots < 1) {
            errors.numberOfSpots = "Number of spots must be at least 1";
        }
        if (formData.price < 1) {
            errors.price = "Price must be at least 1";
        }
        if (!areFilesValid) {
            errors.validFiles = "Files for images must be png or jpg format";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("locationName", formData.locationName);
            formDataToSend.append("latitude", formData.latitude);
            formDataToSend.append("longitude", formData.longitude);
            formDataToSend.append("countryName", formData.countryName);
            formDataToSend.append(
                "verificationDocument",
                formData.verificationDocument
            );
            formDataToSend.append("numberOfSpots", formData.numberOfSpots);
            formDataToSend.append("price", formData.price);

            formData.garageImages.forEach((image) => {
                formDataToSend.append(`garageImages`, image);
            });

            const url = isUpdateMode
                ? `${BASE_URL}/GarageSpot/updateGarageSpot/?garageSpotId=${id}`
                : `${BASE_URL}/GarageSpot/creategaragespot`;

            const method = isUpdateMode ? "PUT" : "POST";
            setLoading(true);
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
                body: formDataToSend,
            });
            const res = await response.json();
            if (res.success) {
                toast.success(
                    isUpdateMode
                        ? "Garage spot updated successfully"
                        : "Garage spot created successfully"
                );
                if (res.value.length > 1) {
                    updateToken(res.value);
                }
            } else {
                const errorResponse = await response.text();
                const errorMessage = isUpdateMode
                    ? "Failed to update garage spot: " + errorResponse
                    : "Failed to create garage spot: " + errorResponse;
                toast.error(errorMessage);
                setError(errorMessage);
            }
        } catch (error) {
            setError("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const targetKey = e.target.name;
        setFormData({ ...formData, [targetKey]: e.target.value });
        if (formErrors[targetKey]) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [targetKey]: null,
            }));
        }
    };

    const scrollDown = () => {
        window.scrollTo({
            top: 900,
            behavior: "smooth",
        });
    };

    return (
        <div className={style.registerContainer}>
            <h1 className={style.title}>
                {isUpdateMode ? "Update Garage Spot" : "Register Garage Spot"}
            </h1>

            <div className={style.mapSection}>
                <div className={style.mapInstructions}>
                    <h3>
                        <MapPin size={20} />
                        Select Location
                    </h3>
                    <p>
                        Click anywhere on the map to select your garage
                        location. This will automatically update the country and
                        coordinates.
                    </p>
                </div>

                <MapConstant setLatlng={setLatlng} />

                <div className={style.locationInfo}>
                    <div className={style.infoItem}>
                        <label>Country</label>
                        <span>{formData.countryName || "Not selected"}</span>
                    </div>
                    <div className={style.infoItem}>
                        <label>Latitude</label>
                        <span>{formData.latitude.toFixed(6)}</span>
                    </div>
                    <div className={style.infoItem}>
                        <label>Longitude</label>
                        <span>{formData.longitude.toFixed(6)}</span>
                    </div>
                </div>

                <ChevronDown
                    className={style.scrollArrow}
                    onClick={scrollDown}
                />
            </div>

            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>Location Name:</label>
                    <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        className={
                            formErrors.locationName ? style.errorInput : ""
                        }
                        placeholder="Enter a name for this location"
                        required
                    />
                    {formErrors.locationName && (
                        <p className={style.error}>{formErrors.locationName}</p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Number of Spots:</label>
                    <input
                        type="number"
                        name="numberOfSpots"
                        value={formData.numberOfSpots}
                        onChange={handleChange}
                        className={
                            formErrors.numberOfSpots ? style.errorInput : ""
                        }
                        placeholder="How many parking spots?"
                    />
                    {formErrors.numberOfSpots && (
                        <p className={style.error}>
                            {formErrors.numberOfSpots}
                        </p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Price per Day:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={formErrors.price ? style.errorInput : ""}
                        placeholder="Daily rate"
                    />
                    {formErrors.price && (
                        <p className={style.error}>{formErrors.price}</p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Verification Document:</label>
                    <input
                        type="file"
                        name="verificationDocument"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                </div>

                <div className={style.formGroup}>
                    <label>Garage Images (Max 7):</label>
                    <input
                        type="file"
                        name="garageImages"
                        multiple
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleMultipleFileChange}
                    />
                    {formErrors.validFiles && (
                        <p className={style.error}>{formErrors.validFiles}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={style.submitButton}
                >
                    {loading ? (
                        <>
                            <span className={style.loadingSpinner}></span>
                            <span>Saving...</span>
                        </>
                    ) : isUpdateMode ? (
                        "Update Garage"
                    ) : (
                        "Create Garage"
                    )}
                </button>
            </form>
        </div>
    );
};

export default GarageForm;
