// ============================================================
// KisanMitra AI - Voice Advisory API
// Handles all agricultural queries with built-in expert knowledge
// ============================================================

import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ============================================================
// Greetings per language
// ============================================================
const GREETINGS: Record<string, string> = {
  hindi: "नमस्ते! मैं KisanMitra AI हूं। मैं खेती, फसलों, कीटों, बीमारियों, मौसम, मंडी भाव और सरकारी योजनाओं के बारे में आपकी मदद कर सकता हूं। आज क्या जानना चाहते हैं?",
  marathi: "नमस्कार! मी KisanMitra AI आहे. मी शेती, पिके, कीड, आजार, हवामान, बाजार भाव आणि सरकारी योजनांबद्दल मदत करू शकतो. आज काय जाणून घ्यायचे आहे?",
  telugu: "నమస్కారం! నేను KisanMitra AI. నేను వ్యవసాయం, పంటలు, పురుగులు, వ్యాధులు, వాతావరణం, మార్కెట్ ధరలు మరియు ప్రభుత్వ పథకాల గురించి మీకు సహాయం చేయగలను.",
  tamil: "வணக்கம்! நான் KisanMitra AI. விவசாயம், பயிர்கள், பூச்சிகள், நோய்கள், வானிலை, சந்தை விலைகள் பற்றி உதவ முடியும்.",
  bengali: "নমস্কার! আমি KisanMitra AI. কৃষি, ফসল, পোকামাকড়, রোগ, আবহাওয়া, বাজার দর সম্পর্কে সাহায্য করতে পারি।",
  gujarati: "નમસ્તે! હું KisanMitra AI છું. ખેતી, પાક, જીવાત, રોગ, હવામાન, બજાર ભાવ વિશે મદદ કરી શકું છું.",
  punjabi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ KisanMitra AI ਹਾਂ. ਖੇਤੀ, ਫਸਲ, ਕੀਟ, ਬਿਮਾਰੀ, ਮੌਸਮ, ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ.",
  english: "Hello! I am KisanMitra AI. I can help you with farming, crops, pests, diseases, weather, market prices, and government schemes. What would you like to know today?",
};

// ============================================================
// Comprehensive Agricultural Knowledge Base
// Covers: crops, pests, diseases, fertilizers, irrigation,
// weather, soil, market prices, government schemes, equipment
// ============================================================
const KNOWLEDGE_BASE: Record<string, Record<string, string>> = {
  hindi: {
    // 🌾 CROPS
    wheat: "गेहूं की बुवाई अक्टूबर-नवंबर में करें। प्रति एकड़ 40-50 किलो बीज का उपयोग करें। HD-2967, PBW-550, WH-1105 किस्में अच्छी हैं। पहली सिंचाई बुवाई के 20-25 दिन बाद करें। NPK 12:32:16 का प्रयोग करें।",
    rice: "धान की खेती के लिए जून-जुलाई में रोपाई करें। IR-64, MTU-7029, स्वर्णा किस्में उपयुक्त हैं। एक एकड़ में 20-25 किलो बीज पर्याप्त है। खेत में 2-3 सेमी पानी भरा रखें। यूरिया 3 बार में डालें - बुवाई, कल्ले निकलते समय और बाली बनते समय।",
    tomato: "टमाटर की खेती साल में तीन बार हो सकती है। पूसा रूबी, अर्का विकास, हीम सोना अच्छी किस्में हैं। एक एकड़ में 8000-10000 पौधे लगाएं। ड्रिप सिंचाई सबसे अच्छी है। NPK 19:19:19 का स्प्रे करें। कीटों के लिए नीम तेल का प्रयोग करें।",
    onion: "प्याज की बुवाई नवंबर-दिसंबर में करें। N-53, भीमा सुपर, अकोला सफेद किस्में अच्छी हैं। एक एकड़ में 3-4 किलो बीज पर्याप्त है। पौध रोपाई के 45 दिन बाद करें। सिंचाई 7-10 दिन के अंतराल पर करें।",
    cotton: "कपास की बुवाई मई-जून में करें। Bt कपास की किस्में जैसे BG-II RRF, MECH-162 अच्छी हैं। पंक्ति से पंक्ति 90 सेमी और पौधे से पौधे 60 सेमी की दूरी रखें। सफेद मक्खी पर नजर रखें - यह कपास का सबसे बड़ा कीट है।",
    sugarcane: "गन्ने की बुवाई फरवरी-मार्च या अक्टूबर में करें। Co-0238, Co-86032 किस्में अच्छी हैं। एक एकड़ में 6000-8000 आंखे लगाएं। सिंचाई 10-15 दिन के अंतराल पर करें। यूरिया 200 किलो प्रति एकड़ डालें।",
    potato: "आलू की बुवाई अक्टूबर में करें। कुफरी चंद्रमुखी, कुफरी पुखराज अच्छी किस्में हैं। एक एकड़ में 8-10 क्विंटल बीज की जरूरत होती है। सिंचाई 8-10 दिन के अंतराल पर करें। NPK 12:32:16 का प्रयोग करें।",
    chili: "मिर्च की खेती जून-जुलाई में करें। तेजा, पंजाब लाल, काशी अनार किस्में अच्छी हैं। पौधशाला में बीज बोएं और 30-35 दिन बाद रोपाई करें। सूखा रहने पर 5-7 दिन में सिंचाई करें।",
    maize: "मक्का की बुवाई जून-जुलाई में करें। एक हाइब्रिड किस्म DKC-9108 अच्छी है। एक एकड़ में 8-10 किलो बीज पर्याप्त है। पंक्ति से पंक्ति 60 सेमी और पौधे से पौधे 20 सेमी दूरी रखें।",
    soybean: "सोयाबीन की बुवाई जून-जुलाई में करें। JS-9560, JS-2034 किस्में अच्छी हैं। एक एकड़ में 25-30 किलो बीज की जरूरत है। पीला मोज़ेक वायरस से बचने के लिए सफेद मक्खी का नियंत्रण करें।",
    groundnut: "मूंगफली की बुवाई मई-जून में करें। TG-37A, GG-20 किस्में अच्छी हैं। एक एकड़ में 40-50 किलो बीज पर्याप्त है। फसल 110-120 दिन में पककर तैयार हो जाती है।",
    turmeric: "हल्दी की खेती अप्रैल-मई में करें। सेलम, सुरंगा किस्में अच्छी हैं। एक एकड़ में 8-10 क्विंटल बीज (कंद) की जरूरत है। 8-9 महीने में फसल तैयार होती है।",
    ginger: "अदरक की खेती अप्रैल-मई में करें। रियो-डी-जानेरियो, सुरभी किस्में अच्छी हैं। एक एकड़ में 6-8 क्विंटल बीज की जरूरत है। छाया में खेती करें।",

    // 🐛 PESTS & DISEASES
    pest: "कीट नियंत्रण के लिए IPM (Integrated Pest Management) अपनाएं। 1) नीम तेल 5ml प्रति लीटर पानी में मिलाकर छिड़काव करें। 2) फेरोमोन ट्रैप लगाएं। 3) पीला चिपचिपा ट्रैप का प्रयोग करें। 4) गंभीर स्थिति में कृषि अधिकारी से सलाह लें।",
    disease: "फसल रोगों के लिए: 1) रोग प्रतिरोधी किस्मों का चयन करें। 2) बीज उपचार जरूर करें। 3) फसल चक्र अपनाएं। 4) खेत की सफाई रखें। 5) रोग दिखने पर तुरंत उचित कवकनाशी का छिड़काव करें।",
    fungus: "फफूंद रोग के लिए मैन्कोजेब 75% WP का 2 ग्राम प्रति लीटर पानी में घोल बनाकर छिड़काव करें। 10-15 दिन बाद दोबारा छिड़काव करें। सुबह या शाम को छिड़काव करें।",
    virus: "वायरस रोग फैलने पर रोगी पौधों को हटाकर नष्ट कर दें। सफेद मक्खी, एफिड जैसे वाहक कीटों का नियंत्रण करें। इमिडाक्लोप्रिड 0.5ml प्रति लीटर का छिड़काव करें।",
    bacteria: "जीवाणु रोग के लिए कॉपर ऑक्सीक्लोराइड 3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें। फसल चक्र अपनाएं। संक्रमित पौधों को हटा दें।",
    blight: "झुलसा रोग के लिए मेटालैक्सिल + मैन्कोजेब 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें। 7-10 दिन के अंतराल पर दोहराएं।",
    rust: "रतुआ रोग के लिए प्रोपिकोनाजोल 1ml प्रति लीटर पानी में मिलाकर छिड़काव करें। रोग दिखते ही छिड़काव शुरू करें।",
    whitefly: "सफेद मक्खी नियंत्रण के लिए पीला चिपचिपा ट्रैप लगाएं। इमिडाक्लोप्रिड 0.5ml प्रति लीटर का छिड़काव करें। नीम तेल भी प्रभावी है।",
    aphid: "एफिड (चेपा) के लिए इमिडाक्लोप्रिड 0.3ml प्रति लीटर का छिड़काव करें। नीम तेल 5ml प्रति लीटर भी प्रभावी है।",
    yellow_leaves: "पत्तियों का पीला होना: 1) नाइट्रोजन की कमी - NPK 19:19:19 या यूरिया का छिड़काव करें। 2) अधिक पानी - सिंचाई कम करें। 3) जड़ सड़न - कॉपर ऑक्सीक्लोराइड डालें। 4) मिट्टी परीक्षण कराएं।",

    // 🌱 FERTILIZERS & SOIL
    fertilizer: "उर्वरक का प्रयोग मिट्टी परीक्षण के आधार पर करें। सामान्य सिफारिश: NPK 12:32:16 बुवाई के समय, यूरिया 2-3 बार में ऊपर से। जैविक खाद जैसे गोबर खाद, वर्मीकम्पोस्ट हमेशा बेहतर है। हरी खाद जैसे ढैंचा भी उपयोगी है।",
    organic: "जैविक खेती के लिए: 1) गोबर खाद 5-10 टन प्रति एकड़। 2) वर्मीकम्पोस्ट 2-3 टन। 3) नीम खली 200 किलो। 4) जैविक कीटनाशक - नीम तेल, बीटी। 5) हरी खाद - ढैंचा, सनई।",
    urea: "यूरिया का प्रयोग 3 बार में करें: 1) बुवाई के समय 1/3 भाग। 2) कल्ले निकलते समय 1/3 भाग। 3) बाली/फल बनते समय 1/3 भाग। एक एकड़ में 100-120 किलो यूरिया पर्याप्त है।",
    compost: "वर्मीकम्पोस्ट बनाने के लिए केंचुओं का उपयोग करें। गोबर, पत्तियां, सब्जियों के छिलके मिलाकर 60-90 दिन में तैयार हो जाता है। एक एकड़ में 2-3 टन का प्रयोग करें।",
    soil: "मिट्टी परीक्षण हर 2-3 साल में कराएं। मिट्टी का pH 6.5-7.5 सबसे अच्छा है। काली मिट्टी में कपास, सोयाबीन अच्छी होती है। लाल मिट्टी में दालें, तिलहन अच्छे हैं।",
    nitrogen: "नाइट्रोजन की कमी होने पर पत्तियां पीली हो जाती हैं। यूरिया 100 किलो प्रति एकड़ या NPK 19:19:19 का छिड़काव करें। जैविक विकल्प: हरी खाद, वर्मीकम्पोस्ट।",
    phosphorus: "फास्फोरस के लिए DAP या SSP का प्रयोग करें। बुवाई के समय 50 किलो DAP प्रति एकड़ डालें। यह जड़ विकास और फूल के लिए जरूरी है।",
    potash: "पोटाश के लिए MOP (Muriate of Potash) 40 किलो प्रति एकड़ डालें। यह फलों की गुणवत्ता और रोग प्रतिरोधकता बढ़ाता है।",

    // 💧 IRRIGATION
    irrigation: "आधुनिक सिंचाई: 1) ड्रिप सिंचाई - 40-50% पानी बचत। 2) स्प्रिंकलर - बड़े क्षेत्र के लिए। 3) फरो सिंचाई - पारंपरिक लेकिन कम कुशल। गर्मियों में 3-4 दिन, सर्दियों में 7-10 दिन के अंतराल पर सिंचाई करें।",
    drip: "ड्रिप सिंचाई से 40-50% पानी और 30% उर्वरक की बचत होती है। सरकार 50-90% सब्सिडी देती है। एक एकड़ में 50,000-80,000 रुपये की लागत आती है।",
    water: "फसल के अनुसार पानी की जरूरत: गेहूं 450-650mm, धान 1200-1500mm, कपास 700-1300mm, सब्जियां 400-600mm। मिट्टी में नमी बनाए रखने के लिए मल्चिंग करें।",
    drought: "सूखे से बचाव: 1) सूखा प्रतिरोधी किस्में चुनें। 2) मल्चिंग करें। 3) ड्रिप सिंचाई अपनाएं। 4) खेत की तैयारी में जैविक खाद डालें। 5) फसल बीमा कराएं। PMFBY योजना के तहत बीमा कराएं।",

    // ☁️ WEATHER
    weather: "मौसम की जानकारी: IMD (India Meteorological Department) से जानकारी लें। 1-2 दिन पहले बारिश की भविष्यवाणी से खेती के काम पहले से तय करें। आज मौसम साफ है, खेती के काम कर सकते हैं।",
    rain: "बारिश से पहले: 1) कटाई का काम जल्दी निपटाएं। 2) खाद/दवा का छिड़काव रोकें। 3) खेत में जल निकास की व्यवस्था करें। 4) बीज सूखे स्थान पर रखें।",
    storm: "तूफान/आंधी से बचाव: 1) फसल को सहारा दें (टमाटर, मिर्च)। 2) पेड़ों की छंटाई करें। 3) पॉलीहाउस को मजबूत करें। 4) पशुओं को सुरक्षित स्थान पर रखें।",
    winter: "सर्दियों में: 1) गेहूं, चना, मसूर की बुवाई करें। 2) पाले से बचाव के लिए हल्की सिंचाई रात को करें। 3) सब्जियों पर पॉलीथीन कवर लगाएं। 4) गर्मियों की तैयारी शुरू करें।",
    summer: "गर्मियों में: 1) मूंग, उड़द की बुवाई करें। 2) सिंचाई सुबह जल्दी या शाम को करें। 3) मल्चिंग से नमी बचाएं। 4) पशुओं के लिए छाया और पानी की व्यवस्था करें।",

    // 💰 MARKET & PRICES
    mandi: "मंडी भाव: अपनी नजदीकी APMC मंडी में जाकर भाव जानें। eNAM (www.enam.gov.in) पर ऑनलाइन भाव देख सकते हैं। सरकारी MSP (न्यूनतम समर्थन मूल्य) से कम पर बेचने से बचें।",
    price: "टमाटर ₹2000-3000/क्विंटल, प्याज ₹1500-2500, आलू ₹1000-1500, गेहूं ₹2200-2400 (MSP), धान ₹2200 (MSP), कपास ₹7000+, सोयाबीन ₹4000-5000 प्रति क्विंटल (मौसम के अनुसार बदलता रहता है)।",
    msp: "MSP 2025-26: गेहूं ₹2425/क्विंटल, धान ₹2369, चना ₹5440, मसूर ₹6700, सरसों ₹5950, सूरजमुखी ₹7280, कपास ₹7521, सोयाबीन ₹4892। अपनी फसल MSP पर बेचने के लिए नजदीकी सरकारी खरीद केंद्र पर जाएं।",
    market: "बेहतर मूल्य के लिए: 1) eNAM पर पंजीकरण कराएं। 2) FPO (किसान उत्पादक संगठन) बनाकर सीधे बेचें। 3) सब्जियों को ग्रेडिंग करके बेचें। 4) कोल्ड स्टोरेज का प्रयोग करें।",

    // 🏛️ GOVERNMENT SCHEMES
    scheme: "किसान योजनाएं: 1) PM-KISAN - ₹6000/वर्ष (3 किस्तों में)। 2) PMFBY - फसल बीमा योजना। 3) KCC - किसान क्रेडिट कार्ड, 4% ब्याज। 4) PKVY - जैविक खेती के लिए ₹50,000/हेक्टेयर। 5) PMKSY - सिंचाई योजना। 6) SMAM - कृषि यंत्रों पर सब्सिडी।",
    pm_kisan: "PM-KISAN: पात्र किसानों को ₹6000 प्रति वर्ष मिलते हैं (₹2000 × 3 किस्तें)। pmkisan.gov.in पर पंजीकरण करें। आधार कार्ड, बैंक खाता, जमीन के कागजात जरूरी हैं। हेल्पलाइन: 155261।",
    insurance: "प्रधानमंत्री फसल बीमा योजना (PMFBY): प्राकृतिक आपदा, कीट, बीमारी से फसल नुकसान पर मुआवजा। खरीफ फसल का 2%, रबी का 1.5% प्रीमियम। pmfby.gov.in पर पंजीकरण करें।",
    loan: "किसान क्रेडिट कार्ड (KCC): 4% ब्याज पर ₹3 लाख तक का लोन। फसल, पशुपालन, मत्स्य पालन के लिए। अपने नजदीकी बैंक में आवेदन करें। समय पर भुगतान पर 3% अतिरिक्त छूट।",
    subsidy: "सब्सिडी: 1) ट्रैक्टर - 20-50%। 2) ड्रिप सिंचाई - 55-90%। 3) सोलर पंप - 60%। 4) कृषि यंत्र - 40-50%। 5) पॉलीहाउस - 50-75%। अपने जिले के कृषि विभाग में संपर्क करें।",

    // 🚜 EQUIPMENT & MODERN FARMING
    tractor: "ट्रैक्टर चयन: 1) छोटे खेत (5 एकड़ तक) - 25-35 HP। 2) मध्यम (5-15 एकड़) - 40-50 HP। 3) बड़े (15+ एकड़) - 55+ HP। प्रमुख ब्रांड: महिंद्रा, जॉन डियर, सोनालीका, स्वराज, मैसी फर्ग्यूसन।",
    machine: "आधुनिक कृषि यंत्र: 1) रोटावेटर - मिट्टी तैयारी। 2) सीड ड्रिल - बुवाई। 3) कल्टीवेटर - निराई। 4) हार्वेस्टर - कटाई। 5) थ्रेशर - मड़ाई। 6) स्प्रेयर - छिड़काव।",
    modern: "आधुनिक खेती: 1) ड्रिप और स्प्रिंकलर सिंचाई। 2) पॉलीहाउस/ग्रीनहाउस। 3) हाइड्रोपोनिक्स। 4) ड्रोन से छिड़काव। 5) GPS और सेंसर आधारित खेती। 6) कृषि ऐप्स का उपयोग।",

    // 🐄 LIVESTOCK
    cow: "गाय पालन: 1) HF, जर्सी (दूध)। 2) साहीवाल, गिर (देशी)। 3) संतुलित आहार - हरा चारा, सूखा चारा, दाना। 4) टीकाकरण समय पर करें। 5) दूध ₹30-60/लीटर बेच सकते हैं।",
    buffalo: "भैंस पालन: मुर्रा भैंस सबसे अच्छी है। एक भैंस 8-12 लीटर दूध/दिन दे सकती है। हरा चारा (मक्का, ज्वार), सूखा चारा (भूसा), दाना (खल, चोकर) दें। टीकाकरण जरूरी है।",
    poultry: "मुर्गी पालन: 1) ब्रॉयलर - मांस के लिए (45 दिन में तैयार)। 2) लेयर - अंडे के लिए। 3) 1000 मुर्गियों से ₹50,000-1,00,000/माह कमाई संभव। टीकाकरण जरूरी।",
    goat: "बकरी पालन: छोटे किसानों के लिए उत्तम। जमुनापारी, बीटल, बारबरी किस्में अच्छी हैं। 10 बकरियों से शुरुआत करें। 8-12 महीने में बच्चे। शेड और टीकाकरण जरूरी।",

    // 🌿 FALLBACK
    default: "मैं आपकी कृषि संबंधी किसी भी समस्या में मदद कर सकता हूं। जैसे - फसल की खेती, बीमारी, कीट, खाद, सिंचाई, मौसम, मंडी भाव, सरकारी योजना। कृपया अपना सवाल विस्तार से बताएं।",
  },

  // English fallback (for non-Hindi users)
  english: {
    wheat: "Wheat sowing: October-November. Use 40-50 kg seed/acre. Good varieties: HD-2967, PBW-550, WH-1105. First irrigation 20-25 days after sowing. Apply NPK 12:32:16.",
    rice: "Rice cultivation: Transplant in June-July. Varieties: IR-64, MTU-7029, Swarna. Use 20-25 kg seed/acre. Maintain 2-3 cm water. Apply urea in 3 splits.",
    tomato: "Tomato: 3 crops/year possible. Varieties: Pusa Ruby, Arka Vikas. 8000-10000 plants/acre. Drip irrigation best. Spray NPK 19:19:19. Use neem oil for pests.",
    cotton: "Cotton: Sow May-June. Bt cotton varieties like BG-II RRF. Spacing 90cm x 60cm. Watch for whitefly - the biggest cotton pest.",
    pest: "Pest control with IPM: 1) Neem oil 5ml/L water. 2) Pheromone traps. 3) Yellow sticky traps. 4) Consult agricultural officer for severe cases.",
    disease: "For crop diseases: 1) Use resistant varieties. 2) Treat seeds. 3) Crop rotation. 4) Field sanitation. 5) Spray appropriate fungicide immediately.",
    fertilizer: "Use fertilizer based on soil testing. General: NPK 12:32:16 at sowing, urea in 2-3 splits. Organic compost and vermicompost are always better.",
    irrigation: "Modern irrigation: 1) Drip - saves 40-50% water. 2) Sprinkler for large areas. 3) Furrow - traditional. Summer every 3-4 days, winter 7-10 days.",
    weather: "Weather info from IMD (India Meteorological Department). Plan farm work 1-2 days ahead based on forecast. Today weather is clear, you can do farm work.",
    mandi: "Market prices: Check your nearest APMC mandi or eNAM (www.enam.gov.in) online. Don't sell below government MSP.",
    price: "Indicative prices: Tomato ₹2000-3000/quintal, Onion ₹1500-2500, Potato ₹1000-1500, Wheat ₹2200-2400, Rice ₹2200, Cotton ₹7000+, Soybean ₹4000-5000/quintal.",
    scheme: "Farmer schemes: 1) PM-KISAN - ₹6000/year. 2) PMFBY - crop insurance. 3) KCC - 4% interest loan. 4) PKVY - ₹50,000/ha for organic. 5) PMKSY - irrigation. 6) SMAM - equipment subsidy.",
    pm_kisan: "PM-KISAN: ₹6000/year in 3 installments of ₹2000. Register at pmkisan.gov.in. Need Aadhaar, bank account, land documents. Helpline: 155261.",
    insurance: "PMFBY (Crop Insurance): Compensation for crop loss due to natural disasters, pests, diseases. Premium: 2% for Kharif, 1.5% for Rabi. Register at pmfby.gov.in.",
    loan: "Kisan Credit Card (KCC): Loan up to ₹3 lakh at 4% interest. Apply at your nearest bank. 3% additional discount for timely repayment.",
    cow: "Dairy: HF, Jersey (high milk). Sahiwal, Gir (desi). Balanced feed - green fodder, dry fodder, concentrate. Vaccination on time. Milk sells at ₹30-60/litre.",
    default: "I can help with any agriculture query: crops, diseases, pests, fertilizers, irrigation, weather, market prices, government schemes. Please ask your question in detail.",
  },
};

// Detect query topic from any language
function detectTopic(query: string, lang: string): string {
  const q = query.toLowerCase();

  // Crop detection
  if (q.includes("गेहूं") || q.includes("wheat") || q.includes("गहू")) return "wheat";
  if (q.includes("धान") || q.includes("चावल") || q.includes("rice") || q.includes("paddy")) return "rice";
  if (q.includes("टमाटर") || q.includes("tomato")) return "tomato";
  if (q.includes("प्याज") || q.includes("onion")) return "onion";
  if (q.includes("कपास") || q.includes("cotton")) return "cotton";
  if (q.includes("गन्ना") || q.includes("sugarcane")) return "sugarcane";
  if (q.includes("आलू") || q.includes("potato")) return "potato";
  if (q.includes("मिर्च") || q.includes("chili") || q.includes(" chilli")) return "chili";
  if (q.includes("मक्का") || q.includes("maize") || q.includes("corn")) return "maize";
  if (q.includes("सोयाबीन") || q.includes("soybean")) return "soybean";
  if (q.includes("मूंगफली") || q.includes("groundnut") || q.includes("peanut")) return "groundnut";
  if (q.includes("हल्दी") || q.includes("turmeric")) return "turmeric";
  if (q.includes("अदरक") || q.includes("ginger")) return "ginger";

  // Disease/pest detection
  if (q.includes("कीट") || q.includes("pest") || q.includes("bug") || q.includes("insect") || q.includes("पेस्ट")) return "pest";
  if (q.includes("रोग") || q.includes("disease") || q.includes("बीमारी")) return "disease";
  if (q.includes("फफूंद") || q.includes("fungus") || q.includes("fungal")) return "fungus";
  if (q.includes("वायरस") || q.includes("virus")) return "virus";
  if (q.includes("बैक्टीरिया") || q.includes("bacteria")) return "bacteria";
  if (q.includes("झुलसा") || q.includes("blight")) return "blight";
  if (q.includes("रतुआ") || q.includes("rust")) return "rust";
  if (q.includes("सफेद मक्खी") || q.includes("whitefly") || q.includes("white fly")) return "whitefly";
  if (q.includes("एफिड") || q.includes("चेपा") || q.includes("aphid")) return "aphid";
  if (q.includes("पीले पत्ते") || q.includes("पत्ते पीले") || q.includes("yellow") || q.includes("पिवळे")) return "yellow_leaves";

  // Fertilizer/soil
  if (q.includes("खाद") || q.includes("उर्वरक") || q.includes("fertilizer") || q.includes("manure")) return "fertilizer";
  if (q.includes("जैविक") || q.includes("organic") || q.includes("vermicompost")) return "organic";
  if (q.includes("यूरिया") || q.includes("urea")) return "urea";
  if (q.includes("कम्पोस्ट") || q.includes("compost")) return "compost";
  if (q.includes("मिट्टी") || q.includes("soil")) return "soil";
  if (q.includes("नाइट्रोजन") || q.includes("nitrogen")) return "nitrogen";
  if (q.includes("फास्फोरस") || q.includes("phosphorus") || q.includes("dap")) return "phosphorus";
  if (q.includes("पोटाश") || q.includes("potash") || q.includes("potassium")) return "potash";

  // Irrigation
  if (q.includes("सिंचाई") || q.includes("पानी") || q.includes("irrigation") || q.includes("water")) return "irrigation";
  if (q.includes("ड्रिप") || q.includes("drip")) return "drip";
  if (q.includes("सूखा") || q.includes("drought")) return "drought";

  // Weather
  if (q.includes("मौसम") || q.includes("बारिश") || q.includes("weather") || q.includes("rain") || q.includes("rainfall")) return "weather";
  if (q.includes("बारिश") || q.includes("rain")) return "rain";
  if (q.includes("तूफान") || q.includes("storm") || q.includes("आंधी")) return "storm";
  if (q.includes("सर्दी") || q.includes("winter") || q.includes("ठंड") || q.includes("cold")) return "winter";
  if (q.includes("गर्मी") || q.includes("summer") || q.includes("heat")) return "summer";

  // Market
  if (q.includes("मंडी") || q.includes("भाव") || q.includes("mandi") || q.includes("price") || q.includes("rate")) return "mandi";
  if (q.includes("कीमत") || q.includes("दाम") || q.includes("cost")) return "price";
  if (q.includes("एमएसपी") || q.includes("msp") || q.includes("support price")) return "msp";
  if (q.includes("बाजार") || q.includes("market") || q.includes("बिक्री") || q.includes("sell")) return "market";

  // Government
  if (q.includes("योजना") || q.includes("scheme") || q.includes("सब्सिडी") || q.includes("subsidy")) return "scheme";
  if (q.includes("पीएम किसान") || q.includes("pm-kisan") || q.includes("pmkisan")) return "pm_kisan";
  if (q.includes("बीमा") || q.includes("insurance") || q.includes("pmfby")) return "insurance";
  if (q.includes("लोन") || q.includes("loan") || q.includes("क्रेडिट") || q.includes("kcc") || q.includes("किसान क्रेडिट")) return "loan";
  if (q.includes("सब्सिडी") || q.includes("subsidy") || q.includes("grant")) return "subsidy";

  // Equipment
  if (q.includes("ट्रैक्टर") || q.includes("tractor")) return "tractor";
  if (q.includes("यंत्र") || q.includes("machine") || q.includes("equipment")) return "machine";
  if (q.includes("आधुनिक") || q.includes("modern") || q.includes("नया तरीका") || q.includes("technology")) return "modern";

  // Livestock
  if (q.includes("गाय") || q.includes("cow") || q.includes("डेयरी") || q.includes("dairy") || q.includes("दूध") || q.includes("milk")) return "cow";
  if (q.includes("भैंस") || q.includes("buffalo")) return "buffalo";
  if (q.includes("मुर्गी") || q.includes("poultry") || q.includes("chicken") || q.includes("अंडा")) return "poultry";
  if (q.includes("बकरी") || q.includes("goat")) return "goat";

  return "default";
}

function getSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return "kharif (monsoon)";
  if (month >= 11 || month <= 3) return "rabi (winter)";
  return "zaid (summer)";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, language = "hindi", district = "Pune", state = "Maharashtra" } = body;

    if (!query || String(query).trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Detect language if not specified or unknown
    let lang = language;
    if (!GREETINGS[lang]) {
      // Auto-detect: if query has Devanagari, default to Hindi
      if (/[ऀ-ॿ]/.test(query)) lang = "hindi";
      else lang = "english";
    }

    // Greeting
    const lower = query.toLowerCase().trim();
    const greetingKeywords = ["hello", "hi", "नमस्ते", "नमस्कार", "हैलो", "हाय", "hey"];
    if (greetingKeywords.some((k) => lower === k || lower.startsWith(k + " ") || lower.endsWith(" " + k))) {
      return NextResponse.json({
        success: true,
        query,
        response: GREETINGS[lang],
        language: lang,
        query_type: "greeting",
        season: getSeason(),
      });
    }

    // Detect topic
    const topic = detectTopic(query, lang);
    const langResponses = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE.hindi;
    let responseText = langResponses[topic] || langResponses.default;

    // Try Gemini for richer answer if key present
    if (GEMINI_API_KEY) {
      try {
        const prompt = `You are KisanMitra AI, an expert Indian agricultural advisor. The farmer asked: "${query}". Respond in ${lang === "english" ? "English" : lang === "hindi" ? "Hindi" : lang}. Be specific with crop names, dosages, and prices in INR. Keep it under 100 words.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText && aiText.length > 20) {
            responseText = aiText;
          }
        }
      } catch {
        // Use built-in answer
      }
    }

    return NextResponse.json({
      success: true,
      query,
      response: responseText,
      language: lang,
      query_type: topic,
      season: getSeason(),
      location: { district, state },
    });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "KisanMitra Voice API",
    status: "operational",
    languages: ["hindi", "english", "marathi", "telugu", "tamil", "bengali", "gujarati", "punjabi"],
    topics: ["crops", "diseases", "pests", "fertilizers", "irrigation", "weather", "mandi prices", "schemes", "loans", "livestock", "equipment"],
    features: ["voice_advisory", "comprehensive_kb", "multilingual"],
  });
}
