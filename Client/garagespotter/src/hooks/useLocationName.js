const getLatLngFromCountry = async (countryName) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(
                countryName
            )}&format=json`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }

        const results = await response.json();
        if (results.length === 0) {
            throw new Error("No results found for the specified country");
        }
        console.log(results);
        const { lat, lon, name } = results[0];
        return { lat, lon, name };
    } catch (error) {
        console.error("Error fetching lat/lng:", error);
        return null;
    }
};

export default getLatLngFromCountry;
