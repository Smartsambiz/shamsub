export const fetchVariations = async (serviceID: string) => {
  try {
    const response = await fetch(`https://smartsambiz-1.o.com/api/variations?serviceID=${serviceID}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching variations:", error);
    return null;
  }
};
