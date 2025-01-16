import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config/config";
import MapConstant from "../Home/map/constants/constantMap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, ChevronDown, X } from "lucide-react";
import style from "./garageForm.module.scss";

const GarageForm = () => {
    const [latlng, setLatlng] = useState([43.23132, 21.21321]);
    const [areFilesValid, setAreFilesValid] = useState(true);
    const [error, setError] = useState("");
    const { authData, updateToken } = useContext(AuthContext);
    const { id } = useParams();
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [existingImages, setExistingImages] = useState([]);
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
    const navigate = useNavigate();

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(
                                new File([blob], file.name, {
                                    type: "image/jpeg",
                                    lastModified: Date.now(),
                                })
                            );
                        },
                        "image/jpeg",
                        0.7 // compression quality
                    );
                };
            };
        });
    };
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
                setExistingImages(data.garageImages || []);
                setFormData({
                    locationName: data.locationName,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    countryName: data.countryName,
                    verificationDocument: data.verificationDocument,
                    numberOfSpots: data.totalSpots?.length,
                    price: data.price,
                    garageImages: [],
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
        if (name === "garageImages") {
            handleMultipleFileChange(e);
        } else {
            const file = files[0];
            if (file) {
                if (name === "verificationDocument") {
                    const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // for .docx files
                        "application/msword", // for .doc files
                    ];
                    if (!validTypes.includes(file.type)) {
                        setFormErrors((prev) => ({
                            ...prev,
                            verificationDocument:
                                "Please upload a valid image (JPG, PNG) or PDF file",
                        }));
                        return;
                    }
                }
                setFormData((prev) => ({ ...prev, [name]: file }));
                setFormErrors((prev) => ({ ...prev, [name]: null }));
            }
        }
    };

    const handleMultipleFileChange = async (e) => {
        const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];
        const selectedFiles = Array.from(e.target.files);
        const invalidFiles = selectedFiles.filter(
            (file) => !validImageTypes.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setFormErrors((prev) => ({
                ...prev,
                garageImages: "Only JPG and PNG images are allowed",
            }));
            setAreFilesValid(false);
            return;
        }

        if (
            selectedFiles.length +
                formData.garageImages.length +
                existingImages.length >
            7
        ) {
            setFormErrors((prev) => ({
                ...prev,
                garageImages: "You can only upload a maximum of 7 images",
            }));
            setAreFilesValid(false);
            return;
        }

        setAreFilesValid(true);
        setFormErrors((prev) => ({ ...prev, garageImages: null }));
        const compressedFiles = await Promise.all(
            selectedFiles.map((file) => compressImage(file))
        );
        setFormData((prev) => ({
            ...prev,
            garageImages: [...prev.garageImages, ...compressedFiles],
        }));
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            garageImages: prev.garageImages.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const errors = {};

        // Location name validation
        if (!formData.locationName.trim()) {
            errors.locationName = "Location name is required";
        } else if (formData.locationName.length < 3) {
            errors.locationName =
                "Location name must be at least 3 characters long";
        } else if (formData.locationName.length > 50) {
            errors.locationName =
                "Location name must be less than 50 characters";
        }

        // Number of spots validation
        const spots = Number(formData.numberOfSpots);
        if (!formData.numberOfSpots) {
            errors.numberOfSpots = "Number of spots is required";
        } else if (isNaN(spots) || !Number.isInteger(spots)) {
            errors.numberOfSpots = "Number of spots must be a whole number";
        } else if (spots < 1) {
            errors.numberOfSpots = "Number of spots must be at least 1";
        } else if (spots > 20) {
            errors.numberOfSpots = "Number of spots cannot exceed 100";
        }

        // Price validation
        const price = Number(formData.price);
        if (!formData.price) {
            errors.price = "Price is required";
        } else if (isNaN(price) || price < 0) {
            errors.price = "Price must be a positive number";
        } else if (price > 1000) {
            errors.price = "Price cannot exceed 1000";
        }

        // Verification document validation
        if (!isUpdateMode && !formData.verificationDocument) {
            errors.verificationDocument = "Verification document is required";
        }

        // Image validation
        if (!areFilesValid) {
            errors.garageImages =
                "Please ensure all images are in valid format (JPG or PNG)";
        }

        const totalImages =
            existingImages.length + formData.garageImages.length;
        if (!isUpdateMode && totalImages === 0) {
            errors.garageImages = "At least one garage image is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please correct all errors before submitting");
            return;
        }
        try {
            setLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append("locationName", formData.locationName.trim());
            formDataToSend.append("latitude", formData.latitude);
            formDataToSend.append("longitude", formData.longitude);
            formDataToSend.append("countryName", formData.countryName);
            formDataToSend.append("numberOfSpots", formData.numberOfSpots);
            formDataToSend.append("price", formData.price);

            if (formData.verificationDocument) {
                formDataToSend.append(
                    "verificationDocument",
                    formData.verificationDocument
                );
            }

            existingImages.forEach((imageUrl) => {
                formDataToSend.append("existingImages", imageUrl);
            });
            formData.garageImages.forEach((image) => {
                formDataToSend.append("garageImages", image);
            });

            const url = isUpdateMode
                ? `${BASE_URL}/GarageSpot/updateGarageSpot/?garageSpotId=${id}`
                : `${BASE_URL}/GarageSpot/creategaragespot`;

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
                        ? "Garage spot updated successfully"
                        : "Garage spot created successfully"
                );
                setTimeout(() => {
                    navigate("/garages");
                }, 1000);
                if (result.value?.length > 1) {
                    updateToken(result.value);
                }
            } else {
                throw new Error(result.message || "Operation failed");
            }
        } catch (error) {
            toast.error(error.message || "Failed to process request");
            setError(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: null }));
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
                    />
                    {formErrors.locationName && (
                        <p className={style.errorMessage}>
                            {formErrors.locationName}
                        </p>
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
                        min="1"
                        max="20"
                    />
                    {formErrors.numberOfSpots && (
                        <p className={style.errorMessage}>
                            {formErrors.numberOfSpots}
                        </p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Price per Hour:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={formErrors.price ? style.errorInput : ""}
                        placeholder="Daily rate"
                        min="0"
                        max="1000"
                    />
                    {formErrors.price && (
                        <p className={style.errorMessage}>{formErrors.price}</p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Verification Document:</label>
                    <input
                        type="file"
                        name="verificationDocument"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.docx"
                        className={
                            formErrors.verificationDocument
                                ? style.errorInput
                                : ""
                        }
                    />
                    {formErrors.verificationDocument && (
                        <p className={style.errorMessage}>
                            {formErrors.verificationDocument}
                        </p>
                    )}
                </div>

                <div className={style.formGroup}>
                    <label>Garage Images (Max 7):</label>
                    {existingImages.length > 0 && (
                        <div className={style.imageGrid}>
                            {existingImages.map((imageUrl, index) => (
                                <div
                                    key={`existing-${index}`}
                                    className={style.imageContainer}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Garage ${index + 1}`}
                                        className={style.previewImage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeExistingImage(index)
                                        }
                                        className={style.removeButton}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {formData.garageImages.length > 0 && (
                        <div className={style.imageGrid}>
                            {formData.garageImages.map((file, index) => (
                                <div
                                    key={`new-${index}`}
                                    className={style.imageContainer}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`New garage ${index + 1}`}
                                        className={style.previewImage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className={style.removeButton}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        name="garageImages"
                        multiple
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleFileChange}
                        className={`${style.fileInput} ${
                            formErrors.garageImages ? style.errorInput : ""
                        }`}
                    />
                    {formErrors.garageImages && (
                        <p className={style.errorMessage}>
                            {formErrors.garageImages}
                        </p>
                    )}
                    <p className={style.imageCount}>
                        {existingImages.length + formData.garageImages.length}/7
                        images
                    </p>
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

                {error && <p className={style.error}>{error}</p>}
            </form>
        </div>
    );
};

export default GarageForm;
