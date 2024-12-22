export const getCountryCoordinates = async (countryName) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${countryName}&format=json&accept-language=en`
        );

        if (!response.ok) {
            throw new Error(`Fetch failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data[0]) {
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].display_name,
            };
        }
        throw new Error("Country not found");
    } catch (error) {
        console.error("Error getting country coordinates:", error);
        throw error;
    }
};
