import { getBrowserLocation } from "./browserGeolocation";

const MAX_ATTEMPTS = 3; // Increased attempts
const RETRY_DELAY = 2000; // Delay between attempts
const DEFAULT_ACCEPTABLE_ACCURACY = 100;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCurrentPosition = async (
    acceptableAccuracy = DEFAULT_ACCEPTABLE_ACCURACY
) => {
    let permissionStatus;

    try {
        permissionStatus = await navigator.permissions?.query({
            name: "geolocation",
        });
    } catch (error) {
        console.warn("Permission status check not supported:", error);
    }

    if (permissionStatus?.state === "denied") {
        throw new Error(
            "Location permission is denied. Please enable location access in your browser settings."
        );
    }

    const readings = [];
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
        try {
            const options = {
                enableHighAccuracy: attempts < 2,
                timeout: attempts === 0 ? 10000 : 15000,
            };
            const reading = await getBrowserLocation(options);
            readings.push(reading);
            if (reading.accuracy <= acceptableAccuracy) {
                return reading;
            }

            if (permissionStatus?.state === "prompt" && attempts === 0) {
                return reading;
            }

            if (attempts < MAX_ATTEMPTS - 1) {
                await sleep(RETRY_DELAY);
            }
        } catch (error) {
            if (error.message === "Location permission denied") {
                throw error;
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                console.warn("Position unavailable. Retrying...");
            } else if (error.code === error.TIMEOUT) {
                // Implement exponential backoff with jitter
                const backoffDelay = RETRY_DELAY * Math.pow(2, attempts);
                const jitter = Math.random() * (backoffDelay / 2);
                await sleep(backoffDelay + jitter);
            } else {
                console.warn(`Attempt ${attempts + 1} failed:`, error);
            }
        }
        attempts++;
    }

    if (readings.length > 0) {
        const bestReading = readings.reduce((best, current) =>
            current.accuracy < best.accuracy ? current : best
        );

        console.warn(
            `Returning best available position (accuracy: ${bestReading.accuracy}m) after ${attempts} attempts`
        );
        return bestReading;
    }

    throw new Error(
        "Unable to get location. Please check your browser settings and try again."
    );
};
