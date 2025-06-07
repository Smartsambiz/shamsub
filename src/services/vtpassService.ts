export const processVTpassPurchase = async (data: any) => {
    try {
      const response = await fetch("/api/vtpass-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), //Not {data} — just data
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error calling backend VTpass route:", error);
      return { status: "error", message: "Failed to process VTpass transaction" };
    }
  };
  