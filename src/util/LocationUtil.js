import * as Constants from "../common/Constants";

const fetchLocationName = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      Constants.GET
    );
    const data = await response.json();
    return data.display_name; // This contains the location name
  } catch (error) {
    console.error("Error fetching location name:", error);
    return null;
  }
};

export default fetchLocationName;
