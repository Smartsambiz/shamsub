export const fetchVariations = async (serviceID: string) => {
  try {
    const response = await fetch(`https://api.shamsub.com.ng/api/variations?serviceID=${serviceID}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching variations:", error);
    return null;
  }
};
