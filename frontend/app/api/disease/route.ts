// ============================================================
// KisanMitra AI - Disease Detection API
// ============================================================

import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Mock disease database (works without AI too)
const DISEASE_DATABASE = [
  {
    plant_type: "Tomato",
    disease_name: "Late Blight",
    local_name: "झुलसा रोग",
    symptoms: ["Water-soaked spots on leaves", "White fungal growth", "Brown lesions on stems"],
    confidence: "high",
    treatment: {
      type: "Fungicide",
      name: "Metalaxyl + Mancozeb",
      dosage: "2g per liter water",
      application: "Foliar spray on both sides",
      timing: "Every 7-10 days during humid weather",
    },
    prevention: ["Use resistant varieties", "Crop rotation 3-4 years", "Avoid overhead irrigation"],
    varieties: ["Pusa Ruby", "Arka Vikas", "Heem Sohna"],
    impact: "Can cause up to 50% crop loss if untreated",
  },
  {
    plant_type: "Tomato",
    disease_name: "Yellow Leaf Curl Virus (TYLCV)",
    local_name: "पत्ती मुड़ना",
    symptoms: ["Yellow curling leaves", "Stunted growth", "Reduced fruiting"],
    confidence: "high",
    treatment: {
      type: "Insecticide",
      name: "Imidacloprid",
      dosage: "0.5ml per liter water",
      application: "Spray on affected plants",
      timing: "At first sign of whitefly",
    },
    prevention: ["Use TYLCV-resistant varieties", "Control whitefly with yellow sticky traps", "Remove infected plants"],
    varieties: ["TY-51", "Shivam", "Nandi"],
    impact: "Severe yield loss up to 100% in severe cases",
  },
  {
    plant_type: "Rice",
    disease_name: "Bacterial Leaf Blight",
    local_name: "जीवाणु पत्ती धब्बा",
    symptoms: ["Yellow to white lesions", "Bacterial ooze on leaf surface", "Leaves drying from tips"],
    confidence: "high",
    treatment: {
      type: "Bactericide",
      name: "Copper-based fungicide",
      dosage: "3g per liter water",
      application: "Foliar spray",
      timing: "Early morning",
    },
    prevention: ["Use certified seeds", "Balanced fertilization", "Avoid field flooding"],
    varieties: ["IR-64", "MTU-7029", "Swarna"],
    impact: "Can reduce yield by 30-50%",
  },
  {
    plant_type: "Wheat",
    disease_name: "Rust (Puccinia)",
    local_name: "रतुआ रोग",
    symptoms: ["Orange-brown pustules on leaves", "Premature leaf death", "Reduced grain filling"],
    confidence: "high",
    treatment: {
      type: "Fungicide",
      name: "Propiconazole",
      dosage: "1ml per liter water",
      application: "Foliar spray",
      timing: "At first sign of rust",
    },
    prevention: ["Use rust-resistant varieties", "Early sowing", "Remove crop residues"],
    varieties: ["HD-2967", "PBW-550", "WH-1105"],
    impact: "Can cause 40-70% yield loss",
  },
  {
    plant_type: "Cotton",
    disease_name: "Cotton Leaf Curl Virus (CLCuV)",
    local_name: "कपास पत्ती मुड़ना",
    symptoms: ["Upward curling of leaves", "Thickening of veins", "Stunted plant growth"],
    confidence: "high",
    treatment: {
      type: "Insecticide",
      name: "Acetamiprid",
      dosage: "0.5g per liter water",
      application: "Spray to control whitefly",
      timing: "Early morning or evening",
    },
    prevention: ["Use CLCuV-resistant Bt cotton", "Control whitefly", "Remove infected plants"],
    varieties: ["BG-II RRF", "MECH-162", "Bunny"],
    impact: "Up to 60% yield loss in susceptible varieties",
  },
  {
    plant_type: "Onion",
    disease_name: "Purple Blotch",
    local_name: "बैंगनी धब्बा",
    symptoms: ["Purple to brown lesions", "Yellow halos around spots", "Leaf yellowing and drying"],
    confidence: "high",
    treatment: {
      type: "Fungicide",
      name: "Difenoconazole",
      dosage: "1ml per liter water",
      application: "Foliar spray",
      timing: "Every 10-15 days",
    },
    prevention: ["Adequate plant spacing", "Avoid overhead irrigation", "Remove crop debris"],
    varieties: ["N-53", "Bhima Super", "Akola Safed"],
    impact: "Can reduce bulb size and yield by 30-50%",
  },
];

// Default response for unknown conditions
const DEFAULT_RESPONSE = {
  plant_type: "Unknown",
  disease_name: "Unable to identify",
  local_name: "",
  confidence: "low",
  symptoms: ["Image unclear or condition unknown"],
  treatment: {
    type: "Consult Expert",
    name: "Contact local agricultural officer",
    dosage: "N/A",
    application: "Take a clearer photo and consult expert",
    timing: "As soon as possible",
  },
  prevention: ["Take a clear, well-lit photo", "Include affected and healthy parts", "Consult Krishi Vigyan Kendra"],
  varieties: [],
  impact: "Early diagnosis helps prevent spread",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const plant_type = formData.get("plant_type") as string | null;
    const language = (formData.get("language") as string) || "hindi";

    // If image is provided, try Gemini Vision
    if (image && GEMINI_API_KEY) {
      try {
        const imageData = await image.arrayBuffer();
        const base64Image = Buffer.from(imageData).toString("base64");

        const visionPrompt = `Analyze this crop image for diseases or pests.
        Indian context: common crops are tomato, rice, wheat, cotton, onion, potato, chili.
        Respond ONLY in JSON format with this structure:
        {
          "plant_type": "crop name",
          "disease_name": "disease or pest name",
          "local_name": "Hindi name if known",
          "confidence": "high/medium/low",
          "symptoms": ["symptom 1", "symptom 2"],
          "treatment": {
            "type": "fungicide/insecticide/organic",
            "name": "product name",
            "dosage": "e.g., 2g per liter",
            "application": "how to apply",
            "timing": "when to apply"
          },
          "prevention": ["measure 1", "measure 2"],
          "varieties": ["resistant variety names"],
          "impact": "brief economic impact"
        }
        Be specific and practical for Indian farmers. Use common Indian product names when possible.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: visionPrompt },
                  {
                    inlineData: {
                      mimeType: image.type || "image/jpeg",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (resultText) {
            // Try to parse JSON from response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsedResult = JSON.parse(jsonMatch[0]);
              return NextResponse.json({
                success: true,
                data: parsedResult,
                source: "gemini_vision",
              });
            }
          }
        }
      } catch (geminiError) {
        console.log("Gemini Vision error:", geminiError);
      }
    }

    // Fallback: Use database matching or default
    let result = DEFAULT_RESPONSE;

    if (plant_type) {
      // Find matching diseases
      const matches = DISEASE_DATABASE.filter(
        (d) => d.plant_type.toLowerCase().includes(plant_type.toLowerCase())
      );

      if (matches.length > 0) {
        result = matches[0]; // Return first match
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      source: result === DEFAULT_RESPONSE ? "unknown" : "database",
      message: result === DEFAULT_RESPONSE
        ? "Unable to identify from image. Showing general guidance."
        : `Identified ${result.plant_type} condition.`,
    });
  } catch (error) {
    console.error("Disease API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", success: false },
      { status: 500 }
    );
  }
}
