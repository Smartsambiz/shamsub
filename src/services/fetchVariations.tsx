export const fetchVariations = async (serviceID: string) => {
  try {
    const response = await fetch(`shamsubbackend-production.up.railway.app/api/variations?serviceID=${serviceID}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching variations:", error);
    return null;
  }
};
