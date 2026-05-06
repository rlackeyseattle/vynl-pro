export interface VenueData {
  name: string;
  address: string;
  phone: string;
  bookingEmail: string;
  ageRequirement: string;
  averagePay: string;
  imageDescription: string; // To help find/generate photos
}

export async function crawlVenueIntelligence(query: string): Promise<VenueData | null> {
  try {
    const response = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning",
        input: `Extract and crawl detailed professional booking info for this music venue: "${query}". 
        Return a JSON object with: name, address, phone, bookingEmail, ageRequirement, averagePay, imageDescription. 
        Focus on real-world accuracy for local bands.`
      }),
    });

    if (!response.ok) {
      console.error("X.AI API Error:", await response.text());
      return null;
    }

    const data = await response.json();
    // Assuming the response structure based on the curl provided
    // If it's a raw reasoning response, we might need to parse the text.
    // Given the "responses" endpoint, it might return a "message" or "text" field.
    const content = data.message || data.text || data.response;
    
    try {
      // Try to parse JSON from the response text if it's not already structured
      return typeof content === 'string' ? JSON.parse(content.match(/\{.*\}/s)?.[0] || content) : content;
    } catch (e) {
      console.warn("Failed to parse Grok JSON, returning raw content as fallback");
      return null;
    }
  } catch (error) {
    console.error("Venue Intelligence Failure:", error);
    return null;
  }
}
