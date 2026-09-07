// ============================================================
// KisanMitra AI - Client-side Data
// Used for static export without server APIs
// ============================================================

export const VOICE_KNOWLEDGE_BASE: Record<string, Record<string, string>> = {
  hindi: {
    wheat: "गेहूं की बुवाई अक्टूबर-नवंबर में करें। प्रति एकड़ 40-50 किलो बीज का उपयोग करें। HD-2967, PBW-550, WH-1105 किस्में अच्छी हैं। पहली सिंचाई बुवाई के 20-25 दिन बाद करें। NPK 12:32:16 का प्रयोग करें।",
    rice: "धान की खेती के लिए जून-जुलाई में रोपाई करें। IR-64, MTU-7029, स्वर्णा किस्में उपयुक्त हैं। एक एकड़ में 20-25 किलो बीज पर्याप्त है। खेत में 2-3 सेमी पानी भरा रखें। यूरिया 3 बार में डालें।",
    tomato: "टमाटर की खेती साल में तीन बार हो सकती है। पूसा रूबी, अर्का विकास किस्में अच्छी हैं। एक एकड़ में 8000-10000 पौधे लगाएं। ड्रिप सिंचाई सबसे अच्छी है। कीटों के लिए नीम तेल का प्रयोग करें।",
    onion: "प्याज की बुवाई नवंबर-दिसंबर में करें। N-53, भीमा सुपर किस्में अच्छी हैं। एक एकड़ में 3-4 किलो बीज पर्याप्त है। सिंचाई 7-10 दिन के अंतराल पर करें।",
    cotton: "कपास की बुवाई मई-जून में करें। Bt कपास की किस्में अच्छी हैं। पंक्ति से पंक्ति 90 सेमी और पौधे से पौधे 60 सेमी की दूरी रखें। सफेद मक्खी पर नजर रखें।",
    potato: "आलू की बुवाई अक्टूबर में करें। कुफरी चंद्रमुखी, कुफरी पुखराज अच्छी किस्में हैं। एक एकड़ में 8-10 क्विंटल बीज की जरूरत होती है।",
    maize: "मक्का की बुवाई जून-जुलाई में करें। हाइब्रिड किस्म अच्छी है। एक एकड़ में 8-10 किलो बीज पर्याप्त है।",
    pest: "कीट नियंत्रण के लिए IPM अपनाएं। नीम तेल 5ml प्रति लीटर पानी में मिलाकर छिड़काव करें। पीला चिपचिपा ट्रैप का प्रयोग करें। गंभीर स्थिति में कृषि अधिकारी से सलाह लें।",
    disease: "फसल रोगों के लिए: रोग प्रतिरोधी किस्मों का चयन करें। बीज उपचार जरूर करें। फसल चक्र अपनाएं। खेत की सफाई रखें। उचित कवकनाशी का छिड़काव करें।",
    fertilizer: "उर्वरक का प्रयोग मिट्टी परीक्षण के आधार पर करें। NPK 12:32:16 बुवाई के समय, यूरिया 2-3 बार में ऊपर से। जैविक खाद जैसे गोबर खाद, वर्मीकम्पोस्ट हमेशा बेहतर है।",
    irrigation: "आधुनिक सिंचाई: ड्रिप सिंचाई से 40-50% पानी बचत। स्प्रिंकलर बड़े क्षेत्र के लिए। गर्मियों में 3-4 दिन, सर्दियों में 7-10 दिन के अंतराल पर सिंचाई करें।",
    weather: "मौसम की जानकारी IMD से लें। आज मौसम साफ है, खेती के काम कर सकते हैं। 1-2 दिन पहले बारिश की भविष्यवाणी से खेती के काम पहले से तय करें।",
    mandi: "मंडी भाव: eNAM (www.enam.gov.in) पर ऑनलाइन भाव देख सकते हैं। सरकारी MSP से कम पर बेचने से बचें।",
    price: "टमाटर ₹2000-3000/क्विंटल, प्याज ₹1500-2500, आलू ₹1000-1500, गेहूं ₹2200-2400 (MSP), धान ₹2200 (MSP), कपास ₹7000+, सोयाबीन ₹4000-5000 प्रति क्विंटल।",
    scheme: "किसान योजनाएं: PM-KISAN - ₹6000/वर्ष, PMFBY - फसल बीमा, KCC - 4% ब्याज लोन, PKVY - जैविक खेती, PMKSY - सिंचाई, SMAM - कृषि यंत्र सब्सिडी।",
    pm_kisan: "PM-KISAN: पात्र किसानों को ₹6000 प्रति वर्ष मिलते हैं (₹2000 × 3 किस्तें)। pmkisan.gov.in पर पंजीकरण करें। हेल्पलाइन: 155261।",
    insurance: "PMFBY: प्राकृतिक आपदा, कीट, बीमारी से फसल नुकसान पर मुआवजा। खरीफ फसल का 2%, रबी का 1.5% प्रीमियम। pmfby.gov.in पर पंजीकरण करें।",
    loan: "KCC: 4% ब्याज पर ₹3 लाख तक का लोन। अपने नजदीकी बैंक में आवेदन करें। समय पर भुगतान पर 3% अतिरिक्त छूट।",
    cow: "गाय पालन: HF, जर्सी (दूध)। साहीवाल, गिर (देशी)। संतुलित आहार - हरा चारा, सूखा चारा, दाना। टीकाकरण समय पर करें।",
    yellow_leaves: "पत्तियों का पीला होना: नाइट्रोजन की कमी - NPK 19:19:19 का छिड़काव करें। अधिक पानी - सिंचाई कम करें। जड़ सड़न - कॉपर ऑक्सीक्लोराइड डालें।",
    default: "मैं आपकी कृषि संबंधी किसी भी समस्या में मदद कर सकता हूं। जैसे - फसल की खेती, बीमारी, कीट, खाद, सिंचाई, मौसम, मंडी भाव, सरकारी योजना। कृपया अपना सवाल विस्तार से बताएं।",
  },
  english: {
    wheat: "Wheat sowing: October-November. Use 40-50 kg seed/acre. Good varieties: HD-2967, PBW-550, WH-1105. First irrigation 20-25 days after sowing. Apply NPK 12:32:16.",
    rice: "Rice cultivation: Transplant in June-July. Varieties: IR-64, MTU-7029, Swarna. Use 20-25 kg seed/acre. Maintain 2-3 cm water. Apply urea in 3 splits.",
    tomato: "Tomato: 3 crops/year possible. Varieties: Pusa Ruby, Arka Vikas. 8000-10000 plants/acre. Drip irrigation best. Use neem oil for pests.",
    cotton: "Cotton: Sow May-June. Bt cotton varieties. Spacing 90cm x 60cm. Watch for whitefly.",
    pest: "Pest control with IPM: Neem oil 5ml/L water. Pheromone traps. Yellow sticky traps. Consult agricultural officer for severe cases.",
    disease: "For crop diseases: Use resistant varieties. Treat seeds. Crop rotation. Field sanitation. Spray appropriate fungicide immediately.",
    fertilizer: "Use fertilizer based on soil testing. NPK 12:32:16 at sowing, urea in 2-3 splits. Organic compost and vermicompost are always better.",
    irrigation: "Modern irrigation: Drip saves 40-50% water. Sprinkler for large areas. Summer every 3-4 days, winter 7-10 days.",
    weather: "Weather info from IMD. Plan farm work 1-2 days ahead based on forecast. Today weather is clear, you can do farm work.",
    mandi: "Market prices: Check your nearest APMC mandi or eNAM (www.enam.gov.in) online. Don't sell below government MSP.",
    price: "Indicative prices: Tomato ₹2000-3000/quintal, Onion ₹1500-2500, Potato ₹1000-1500, Wheat ₹2200-2400, Rice ₹2200, Cotton ₹7000+, Soybean ₹4000-5000/quintal.",
    scheme: "Farmer schemes: PM-KISAN - ₹6000/year. PMFBY - crop insurance. KCC - 4% interest loan. PKVY - ₹50,000/ha for organic. PMKSY - irrigation. SMAM - equipment subsidy.",
    pm_kisan: "PM-KISAN: ₹6000/year in 3 installments of ₹2000. Register at pmkisan.gov.in. Need Aadhaar, bank account, land documents. Helpline: 155261.",
    insurance: "PMFBY: Compensation for crop loss due to natural disasters, pests, diseases. Premium: 2% for Kharif, 1.5% for Rabi. Register at pmfby.gov.in.",
    loan: "Kisan Credit Card (KCC): Loan up to ₹3 lakh at 4% interest. Apply at your nearest bank. 3% additional discount for timely repayment.",
    cow: "Dairy: HF, Jersey (high milk). Sahiwal, Gir (desi). Balanced feed - green fodder, dry fodder, concentrate. Vaccination on time. Milk sells at ₹30-60/litre.",
    default: "I can help with any agriculture query: crops, diseases, pests, fertilizers, irrigation, weather, market prices, government schemes. Please ask your question in detail.",
  },
};

export function detectTopicClient(query: string, lang: string): string {
  const q = query.toLowerCase();
  // Crops
  if (q.includes("गेहूं") || q.includes("wheat") || q.includes("गहू")) return "wheat";
  if (q.includes("धान") || q.includes("चावल") || q.includes("rice") || q.includes("paddy")) return "rice";
  if (q.includes("टमाटर") || q.includes("tomato")) return "tomato";
  if (q.includes("प्याज") || q.includes("onion")) return "onion";
  if (q.includes("कपास") || q.includes("cotton")) return "cotton";
  if (q.includes("आलू") || q.includes("potato")) return "potato";
  if (q.includes("मक्का") || q.includes("maize") || q.includes("corn")) return "maize";
  // Pests/Diseases
  if (q.includes("कीट") || q.includes("pest") || q.includes("bug") || q.includes("insect")) return "pest";
  if (q.includes("रोग") || q.includes("disease") || q.includes("बीमारी")) return "disease";
  if (q.includes("पीले पत्ते") || q.includes("yellow") || q.includes("पिवळे")) return "yellow_leaves";
  // Fertilizer/Soil
  if (q.includes("खाद") || q.includes("उर्वरक") || q.includes("fertilizer") || q.includes("manure")) return "fertilizer";
  // Irrigation
  if (q.includes("सिंचाई") || q.includes("पानी") || q.includes("irrigation") || q.includes("water")) return "irrigation";
  // Weather
  if (q.includes("मौसम") || q.includes("बारिश") || q.includes("weather") || q.includes("rain")) return "weather";
  // Market
  if (q.includes("मंडी") || q.includes("भाव") || q.includes("mandi") || q.includes("price") || q.includes("rate")) return "mandi";
  if (q.includes("कीमत") || q.includes("दाम") || q.includes("cost")) return "price";
  // Government
  if (q.includes("योजना") || q.includes("scheme") || q.includes("सब्सिडी") || q.includes("subsidy")) return "scheme";
  if (q.includes("पीएम किसान") || q.includes("pm-kisan") || q.includes("pmkisan")) return "pm_kisan";
  if (q.includes("बीमा") || q.includes("insurance") || q.includes("pmfby")) return "insurance";
  if (q.includes("लोन") || q.includes("loan") || q.includes("क्रेडिट") || q.includes("kcc")) return "loan";
  // Livestock
  if (q.includes("गाय") || q.includes("cow") || q.includes("डेयरी") || q.includes("dairy") || q.includes("दूध") || q.includes("milk")) return "cow";
  return "default";
}

export const MOCK_MANDI_DATA = {
  success: true,
  state: "Maharashtra",
  count: 12,
  prices: [
    { commodity: "Tomato", state: "Maharashtra", market: "Pune APMC", price: 2500, unit: "₹/Quintal", change: 8.7, trend: "up" },
    { commodity: "Onion", state: "Maharashtra", market: "Nashik APMC", price: 1800, unit: "₹/Quintal", change: -5.2, trend: "down" },
    { commodity: "Potato", state: "Maharashtra", market: "Ahmednagar APMC", price: 1200, unit: "₹/Quintal", change: 2.1, trend: "up" },
    { commodity: "Wheat", state: "Maharashtra", market: "Nagpur APMC", price: 2200, unit: "₹/Quintal", change: 0, trend: "stable" },
    { commodity: "Rice", state: "Maharashtra", market: "Kolhapur APMC", price: 2800, unit: "₹/Quintal", change: 3.5, trend: "up" },
    { commodity: "Soybean", state: "Maharashtra", market: "Akola APMC", price: 4500, unit: "₹/Quintal", change: 7.1, trend: "up" },
    { commodity: "Cotton", state: "Maharashtra", market: "Yavatmal APMC", price: 6200, unit: "₹/Quintal", change: 4.2, trend: "up" },
    { commodity: "Jowar", state: "Maharashtra", market: "Solapur APMC", price: 3000, unit: "₹/Quintal", change: -1.8, trend: "down" },
    { commodity: "Bajra", state: "Maharashtra", market: "Pune APMC", price: 2600, unit: "₹/Quintal", change: 1.5, trend: "up" },
    { commodity: "Tur Dal", state: "Maharashtra", market: "Latur APMC", price: 8500, unit: "₹/Quintal", change: -3.2, trend: "down" },
    { commodity: "Groundnut", state: "Maharashtra", market: "Jalgaon APMC", price: 5500, unit: "₹/Quintal", change: 5.8, trend: "up" },
    { commodity: "Sugarcane", state: "Maharashtra", market: "Pune APMC", price: 3500, unit: "₹/Quintal", change: 0, trend: "stable" },
  ],
  date: new Date().toISOString().split("T")[0],
  source: "KisanMitra Demo Data",
};

export const MOCK_WEATHER_DATA = (district: string, state: string = "Maharashtra") => ({
  district,
  state,
  date: new Date().toISOString().split("T")[0],
  temperature: 28 + Math.floor(Math.random() * 6),
  humidity: 55 + Math.floor(Math.random() * 30),
  rainfall: Math.floor(Math.random() * 5),
  wind_speed: 10 + Math.random() * 8,
  weather_type: "Clear",
  icon: "🌤️",
  disease_risk: "LOW - Conditions favorable",
  recommendation: "Weather conditions are favorable for farming.",
  source: "mock_data",
});

export const MOCK_DISEASE_DATABASE = [
  {
    plant_type: "Tomato",
    disease_name: "Late Blight",
    local_name: "झुलसा रोग",
    symptoms: ["Water-soaked spots on leaves", "White fungal growth", "Brown lesions on stems"],
    confidence: "high",
    treatment: { type: "Fungicide", name: "Metalaxyl + Mancozeb", dosage: "2g per liter water", application: "Foliar spray on both sides", timing: "Every 7-10 days during humid weather" },
    prevention: ["Use resistant varieties", "Crop rotation 3-4 years", "Avoid overhead irrigation"],
    varieties: ["Pusa Ruby", "Arka Vikas", "Heem Sohna"],
    impact: "Can cause up to 50% crop loss if untreated",
  },
  {
    plant_type: "Rice",
    disease_name: "Bacterial Leaf Blight",
    local_name: "जीवाणु पत्ती धब्बा",
    symptoms: ["Yellow to white lesions", "Bacterial ooze on leaf surface", "Leaves drying from tips"],
    confidence: "high",
    treatment: { type: "Bactericide", name: "Copper-based fungicide", dosage: "3g per liter water", application: "Foliar spray", timing: "Early morning" },
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
    treatment: { type: "Fungicide", name: "Propiconazole", dosage: "1ml per liter water", application: "Foliar spray", timing: "At first sign of rust" },
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
    treatment: { type: "Insecticide", name: "Acetamiprid", dosage: "0.5g per liter water", application: "Spray to control whitefly", timing: "Early morning or evening" },
    prevention: ["Use CLCuV-resistant Bt cotton", "Control whitefly", "Remove infected plants"],
    varieties: ["BG-II RRF", "MECH-162", "Bunny"],
    impact: "Up to 60% yield loss in susceptible varieties",
  },
];
