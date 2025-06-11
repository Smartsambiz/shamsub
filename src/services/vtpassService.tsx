export const processVTpassPurchase = async (data: any) => {
    try {
      const response = await fetch("https://industrious-contentment-production.up.railway.app/api/vtpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error calling backend VTpass route:", error);
      return { status: "error", message: "Failed to process VTpass transaction" };
    }
  };
  